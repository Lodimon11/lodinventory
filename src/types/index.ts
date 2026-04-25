// types/index.ts
export type TipoActivo = 'notebook' | 'escritorio' | 'telefono'

export type EstadoActivo =
  | 'activo'
  | 'desasignado'
  | 'listo_para_entregar'
  | 'en_reparacion'
  | 'retirado'

export interface Activo {
  id: string
  direccion_mac: string | null
  etiqueta: string
  tipo: TipoActivo
  estado: EstadoActivo
  componentes: Record<string, unknown>
  unido_dominio: boolean
  nombre_equipo: string | null
  sistema_operativo: string | null
  creado_en: string
  actualizado_en: string
}

export interface UsuarioSistema {
  id: string
  nombre_completo: string
  email: string
  departamento: string | null
  cargo: string | null
  creado_en: string
  actualizado_en: string
}

export interface Asignacion {
  id: string
  activo_id: string
  usuario_id: string
  asignado_en: string
  desasignado_en: string | null
  notas: string | null
  creado_en: string
}

export interface Mantenimiento {
  id: string
  activo_id: string
  descripcion: string
  fecha: string
  costo: number | null
  creado_en: string
}

export interface AsignacionConUsuario extends Asignacion {
  usuario: UsuarioSistema
}

export interface AsignacionConActivo extends Asignacion {
  activo: Activo
}

export interface UsuarioConCantidadActivos extends UsuarioSistema {
  cantidad_activos: number
}

export interface AsignacionCompleta extends Asignacion {
  usuario: UsuarioSistema
  activo: Activo
}

export interface MetricasDashboard {
  total: number
  asignados: number
  enReparacion: number
  disponibles: number
}
