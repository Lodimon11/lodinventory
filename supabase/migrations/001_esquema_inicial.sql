-- =============================================================================
-- lodinventory — Migración 001: Esquema inicial
-- Ejecutar en el SQL Editor de Supabase (como superusuario)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONES
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ---------------------------------------------------------------------------
-- TIPOS ENUMERADOS
-- ---------------------------------------------------------------------------

CREATE TYPE tipo_activo AS ENUM (
  'notebook',
  'escritorio',
  'telefono'
);

CREATE TYPE estado_activo AS ENUM (
  'activo',
  'desasignado',
  'listo_para_entregar',
  'en_reparacion',
  'retirado'
);


-- ---------------------------------------------------------------------------
-- TABLA: usuarios_sistema
-- Separada de auth.users para poder tener usuarios IT sin cuenta de auth
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS usuarios_sistema (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT        NOT NULL,
  email          TEXT        NOT NULL UNIQUE,
  departamento   TEXT,
  cargo          TEXT,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  usuarios_sistema                IS 'Empleados/usuarios que pueden recibir activos IT';
COMMENT ON COLUMN usuarios_sistema.nombre_completo IS 'Nombre y apellido del empleado';
COMMENT ON COLUMN usuarios_sistema.departamento    IS 'Área o sector de la empresa';
COMMENT ON COLUMN usuarios_sistema.cargo           IS 'Puesto o rol del empleado';


-- ---------------------------------------------------------------------------
-- TABLA: activos
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activos (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  direccion_mac TEXT         UNIQUE,                          -- puede ser nula en teléfonos CDMA / sin red
  etiqueta      TEXT         NOT NULL UNIQUE,                 -- ej. "NB-042", "PC-017"
  tipo          tipo_activo  NOT NULL,
  estado        estado_activo NOT NULL DEFAULT 'desasignado',
  componentes   JSONB        NOT NULL DEFAULT '{}',           -- RAM, SSD, CPU, etc.
  creado_en     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  activos             IS 'Inventario de equipos y dispositivos IT';
COMMENT ON COLUMN activos.etiqueta    IS 'Código físico pegado en el equipo (ej. NB-042)';
COMMENT ON COLUMN activos.componentes IS 'JSONB libre: { "ram_gb": 16, "ssd_gb": 512, "cpu": "i7-1165G7" }';

-- Índices de búsqueda frecuente
CREATE INDEX idx_activos_estado ON activos (estado);
CREATE INDEX idx_activos_tipo   ON activos (tipo);
CREATE INDEX idx_activos_etiqueta ON activos (etiqueta);


-- ---------------------------------------------------------------------------
-- TABLA: asignaciones
-- Historial completo — nunca se borra (soft logic)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS asignaciones (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  activo_id     UUID        NOT NULL REFERENCES activos (id) ON DELETE RESTRICT,
  usuario_id    UUID        NOT NULL REFERENCES usuarios_sistema (id) ON DELETE RESTRICT,
  asignado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  desasignado_en TIMESTAMPTZ,                                 -- NULL = asignación vigente
  notas         TEXT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  asignaciones               IS 'Historial de asignaciones de activos a usuarios (nunca se elimina)';
COMMENT ON COLUMN asignaciones.desasignado_en IS 'NULL indica que la asignación sigue vigente';
COMMENT ON COLUMN asignaciones.notas          IS 'Observaciones del momento de entrega o devolución';

-- Índices
CREATE INDEX idx_asignaciones_activo  ON asignaciones (activo_id);
CREATE INDEX idx_asignaciones_usuario ON asignaciones (usuario_id);
CREATE INDEX idx_asignaciones_vigente ON asignaciones (activo_id) WHERE desasignado_en IS NULL;


-- ---------------------------------------------------------------------------
-- TABLA: mantenimiento
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mantenimiento (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  activo_id   UUID        NOT NULL REFERENCES activos (id) ON DELETE RESTRICT,
  descripcion TEXT        NOT NULL,
  fecha       DATE        NOT NULL DEFAULT CURRENT_DATE,
  costo       NUMERIC(10, 2),                                 -- en moneda local, opcional
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  mantenimiento        IS 'Registro de reparaciones y mantenimientos preventivos/correctivos';
COMMENT ON COLUMN mantenimiento.costo  IS 'Costo del mantenimiento en moneda local (puede ser nulo si no aplica)';

CREATE INDEX idx_mantenimiento_activo ON mantenimiento (activo_id);
CREATE INDEX idx_mantenimiento_fecha  ON mantenimiento (fecha DESC);


-- ---------------------------------------------------------------------------
-- FUNCIÓN + TRIGGER: actualizar columna "actualizado_en" automáticamente
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_actualizar_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_activos_actualizado_en
  BEFORE UPDATE ON activos
  FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_usuarios_actualizado_en
  BEFORE UPDATE ON usuarios_sistema
  FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();


-- ---------------------------------------------------------------------------
-- FUNCIÓN: desasignar_activo(p_asignacion_id, p_notas)
-- Cierra la asignación vigente y cambia el estado del activo a "desasignado"
-- Regla de negocio: al desasignar → estado pasa a 'desasignado'
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION desasignar_activo(
  p_asignacion_id UUID,
  p_notas         TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_activo_id UUID;
BEGIN
  -- Obtener activo_id y verificar que la asignación esté vigente
  SELECT activo_id INTO v_activo_id
  FROM   asignaciones
  WHERE  id = p_asignacion_id
    AND  desasignado_en IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La asignación % no existe o ya fue cerrada', p_asignacion_id;
  END IF;

  -- Cerrar la asignación
  UPDATE asignaciones
  SET    desasignado_en = NOW(),
         notas          = COALESCE(p_notas, notas)
  WHERE  id = p_asignacion_id;

  -- Cambiar estado del activo → desasignado (regla de negocio)
  UPDATE activos
  SET    estado = 'desasignado'
  WHERE  id = v_activo_id;
END;
$$;

COMMENT ON FUNCTION desasignar_activo IS
  'Cierra una asignación vigente y cambia el estado del activo a desasignado. Regla de negocio central.';


-- ---------------------------------------------------------------------------
-- FUNCIÓN: asignar_activo(p_activo_id, p_usuario_id, p_notas)
-- Valida que el activo no tenga asignación vigente antes de crear una nueva
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION asignar_activo(
  p_activo_id  UUID,
  p_usuario_id UUID,
  p_notas      TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_asignacion_id UUID;
  v_estado        estado_activo;
BEGIN
  -- Verificar que el activo exista y no esté retirado
  SELECT estado INTO v_estado
  FROM   activos
  WHERE  id = p_activo_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Activo % no encontrado', p_activo_id;
  END IF;

  IF v_estado = 'retirado' THEN
    RAISE EXCEPTION 'El activo % está retirado y no puede asignarse', p_activo_id;
  END IF;

  -- Verificar que no haya asignación vigente (un activo = un usuario)
  IF EXISTS (
    SELECT 1 FROM asignaciones
    WHERE  activo_id = p_activo_id
      AND  desasignado_en IS NULL
  ) THEN
    RAISE EXCEPTION 'El activo % ya tiene una asignación vigente', p_activo_id;
  END IF;

  -- Crear la asignación
  INSERT INTO asignaciones (activo_id, usuario_id, notas)
  VALUES (p_activo_id, p_usuario_id, p_notas)
  RETURNING id INTO v_asignacion_id;

  -- Actualizar estado del activo → activo
  UPDATE activos
  SET    estado = 'activo'
  WHERE  id = p_activo_id;

  RETURN v_asignacion_id;
END;
$$;

COMMENT ON FUNCTION asignar_activo IS
  'Crea una nueva asignación validando que el activo no esté ya asignado ni retirado.';


-- ---------------------------------------------------------------------------
-- VISTA: vista_asignaciones_vigentes
-- Activos que tienen asignación activa en este momento
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW vista_asignaciones_vigentes AS
SELECT
  a.id            AS asignacion_id,
  ac.id           AS activo_id,
  ac.etiqueta,
  ac.tipo,
  ac.estado,
  us.id           AS usuario_id,
  us.nombre_completo,
  us.email,
  us.departamento,
  us.cargo,
  a.asignado_en,
  a.notas
FROM asignaciones a
JOIN activos          ac ON ac.id = a.activo_id
JOIN usuarios_sistema us ON us.id = a.usuario_id
WHERE a.desasignado_en IS NULL;

COMMENT ON VIEW vista_asignaciones_vigentes IS 'Activos actualmente asignados con datos del usuario y del equipo';


-- ---------------------------------------------------------------------------
-- VISTA: vista_activos_sin_asignar
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW vista_activos_sin_asignar AS
SELECT *
FROM   activos
WHERE  estado IN ('desasignado', 'listo_para_entregar')
ORDER BY etiqueta;


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Política básica: usuarios autenticados de Supabase Auth leen todo.
-- Los administradores IT gestionan mediante service_role (backend/acciones).
-- ---------------------------------------------------------------------------

-- Habilitar RLS en todas las tablas
ALTER TABLE activos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_sistema  ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimiento     ENABLE ROW LEVEL SECURITY;

-- ·· Políticas de LECTURA para usuarios autenticados ··

CREATE POLICY "lectura_activos_autenticados"
  ON activos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lectura_usuarios_autenticados"
  ON usuarios_sistema FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lectura_asignaciones_autenticados"
  ON asignaciones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lectura_mantenimiento_autenticados"
  ON mantenimiento FOR SELECT
  TO authenticated
  USING (true);

-- ·· Políticas de ESCRITURA: solo rol service_role (llamadas desde Server Actions) ··
-- Las mutaciones se hacen a través de Server Actions con el cliente admin,
-- por lo que no se exponen políticas de INSERT/UPDATE/DELETE al rol anon/authenticated.
-- Esto garantiza que las reglas de negocio (funciones SQL) siempre se respeten.

-- Nota: si querés agregar un rol "admin_it" con permisos completos, podés hacer:
-- CREATE POLICY "escritura_admin_it" ON activos FOR ALL TO admin_it USING (true) WITH CHECK (true);


-- ---------------------------------------------------------------------------
-- DATOS DE PRUEBA (seed opcional — comentar en producción)
-- ---------------------------------------------------------------------------

INSERT INTO usuarios_sistema (nombre_completo, email, departamento, cargo) VALUES
  ('Ana García',      'ana.garcia@empresa.com',      'Tecnología',    'Desarrolladora Senior'),
  ('Carlos Rodríguez','carlos.rodriguez@empresa.com', 'Ventas',       'Ejecutivo de Cuentas'),
  ('María López',     'maria.lopez@empresa.com',     'Administración','Analista Contable'),
  ('Pedro Martínez',  'pedro.martinez@empresa.com',  'Tecnología',    'Infraestructura');

INSERT INTO activos (direccion_mac, etiqueta, tipo, estado, componentes) VALUES
  ('AA:BB:CC:DD:EE:01', 'NB-001', 'notebook',   'desasignado',        '{"ram_gb": 16, "ssd_gb": 512, "cpu": "Intel Core i7-1165G7", "pantalla": "14 pulgadas"}'),
  ('AA:BB:CC:DD:EE:02', 'NB-002', 'notebook',   'listo_para_entregar','{"ram_gb": 8,  "ssd_gb": 256, "cpu": "Intel Core i5-1135G7", "pantalla": "15.6 pulgadas"}'),
  ('AA:BB:CC:DD:EE:03', 'PC-001', 'escritorio', 'desasignado',        '{"ram_gb": 32, "ssd_gb": 1024,"cpu": "AMD Ryzen 7 5700G",    "monitor": "27 pulgadas"}'),
  (NULL,               'TEL-001','telefono',   'desasignado',        '{"modelo": "iPhone 14", "almacenamiento_gb": 128}');

-- Asignar NB-001 a Ana García usando la función
SELECT asignar_activo(
  (SELECT id FROM activos WHERE etiqueta = 'NB-001'),
  (SELECT id FROM usuarios_sistema WHERE email = 'ana.garcia@empresa.com'),
  'Entrega inicial — equipo nuevo'
);

INSERT INTO mantenimiento (activo_id, descripcion, fecha, costo) VALUES
  (
    (SELECT id FROM activos WHERE etiqueta = 'NB-002'),
    'Reemplazo de batería y limpieza general',
    '2026-03-10',
    15000.00
  );
