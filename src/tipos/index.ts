// =============================================================================
// src/tipos/index.ts
// Tipos TypeScript centrales de lodinventory — en español
// =============================================================================

// ---------------------------------------------------------------------------
// Enums — espejo de los tipos PostgreSQL
// ---------------------------------------------------------------------------

export type TipoActivo = 'notebook' | 'escritorio' | 'telefono'

export type EstadoActivo =
  | 'activo'
  | 'desasignado'
  | 'listo_para_entregar'
  | 'en_reparacion'
  | 'retirado'

// ---------------------------------------------------------------------------
// Componentes de un activo (JSONB libre)
// ---------------------------------------------------------------------------

export interface ComponentesActivo {
  ram_gb?: number
  ssd_gb?: number
  cpu?: string
  pantalla?: string
  monitor?: string
  modelo?: string
  almacenamiento_gb?: number
  [clave: string]: unknown
}

// ---------------------------------------------------------------------------
// Activo
// ---------------------------------------------------------------------------

export interface Activo {
  id: string
  direccion_mac: string | null
  etiqueta: string
  tipo: TipoActivo
  estado: EstadoActivo
  componentes: ComponentesActivo
  creado_en: string
  actualizado_en: string
}

export type NuevoActivo = Omit<Activo, 'id' | 'creado_en' | 'actualizado_en'>
export type ActualizarActivo = Partial<NuevoActivo>

// ---------------------------------------------------------------------------
// UsuarioSistema
// ---------------------------------------------------------------------------

export interface UsuarioSistema {
  id: string
  nombre_completo: string
  email: string
  departamento: string | null
  cargo: string | null
  creado_en: string
  actualizado_en: string
}

export type NuevoUsuario = Omit<UsuarioSistema, 'id' | 'creado_en' | 'actualizado_en'>
export type ActualizarUsuario = Partial<NuevoUsuario>

// ---------------------------------------------------------------------------
// Asignacion
// ---------------------------------------------------------------------------

export interface Asignacion {
  id: string
  activo_id: string
  usuario_id: string
  asignado_en: string
  desasignado_en: string | null
  notas: string | null
  creado_en: string
}

export type NuevaAsignacion = Pick<Asignacion, 'activo_id' | 'usuario_id' | 'notas'>

// ---------------------------------------------------------------------------
// Mantenimiento
// ---------------------------------------------------------------------------

export interface Mantenimiento {
  id: string
  activo_id: string
  descripcion: string
  fecha: string
  costo: number | null
  creado_en: string
}

export type NuevoMantenimiento = Omit<Mantenimiento, 'id' | 'creado_en'>

// ---------------------------------------------------------------------------
// Vistas enriquecidas (JOINs)
// ---------------------------------------------------------------------------

export interface AsignacionVigente {
  asignacion_id: string
  activo_id: string
  etiqueta: string
  tipo: TipoActivo
  estado: EstadoActivo
  usuario_id: string
  nombre_completo: string
  email: string
  departamento: string | null
  cargo: string | null
  asignado_en: string
  notas: string | null
}

/** Activo con la asignación vigente embebida (puede ser null) */
export interface ActivoConAsignacion extends Activo {
  asignacion_vigente: AsignacionVigente | null
}

/** Asignación con datos del activo y del usuario (para historial) */
export interface AsignacionDetallada extends Asignacion {
  activo: Pick<Activo, 'etiqueta' | 'tipo'>
  usuario: Pick<UsuarioSistema, 'nombre_completo' | 'email'>
}

// ---------------------------------------------------------------------------
// Respuesta genérica de Server Actions
// ---------------------------------------------------------------------------

export type RespuestaAccion<T = void> =
  | { exito: true; datos: T }
  | { exito: false; error: string }

// ---------------------------------------------------------------------------
// Filtros de búsqueda
// ---------------------------------------------------------------------------

export interface FiltrosActivo {
  tipo?: TipoActivo
  estado?: EstadoActivo
  busqueda?: string
}

export interface FiltrosAsignacion {
  activo_id?: string
  usuario_id?: string
  solo_vigentes?: boolean
}
