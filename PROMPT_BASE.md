Vamos a construir una app web llamada "lodinventory" para gestión de 
activos IT. Stack: Next.js 14 App Router, TypeScript, Tailwind, 
shadcn/ui, Supabase. Idioma de la interfaz: español. Variables, 
funciones y tipos en español.

MODELOS CORE:
- Activo: id, direccion_mac, etiqueta, tipo (notebook|escritorio|telefono), 
  estado (activo|desasignado|listo_para_entregar|en_reparacion|retirado), 
  componentes (jsonb), creado_en
- UsuarioSistema: id, nombre_completo, email, departamento, cargo
- Asignacion: id, activo_id, usuario_id, asignado_en, desasignado_en, notas
- Mantenimiento: id, activo_id, descripcion, fecha, costo

REGLAS DE NEGOCIO:
- Al desasignar un activo, su estado pasa a "desasignado" automáticamente
- Un activo solo puede estar asignado a un usuario a la vez
- El historial de asignaciones nunca se borra (soft logic)
- Nombres de funciones en español: ej. obtenerActivos(), asignarActivo()
- Nombres de variables en español: ej. listaActivos, usuarioActual

TAREA 1: Crear estructura de carpetas del proyecto y el SQL completo 
para Supabase (tablas + RLS básico). Solo eso, nada más.