// =============================================================================
// src/constantes/index.ts
// Constantes de la aplicación — etiquetas UI, colores, opciones de select
// =============================================================================

import type { EstadoActivo, TipoActivo } from '@/tipos'

// ---------------------------------------------------------------------------
// Tipos de activo
// ---------------------------------------------------------------------------

export const TIPOS_ACTIVO: { valor: TipoActivo; etiqueta: string; icono: string }[] = [
  { valor: 'notebook',   etiqueta: 'Notebook',   icono: 'laptop' },
  { valor: 'escritorio', etiqueta: 'Escritorio', icono: 'monitor' },
  { valor: 'telefono',   etiqueta: 'Teléfono',   icono: 'smartphone' },
]

// ---------------------------------------------------------------------------
// Estados del activo — con color para badges
// ---------------------------------------------------------------------------

export const ESTADOS_ACTIVO: {
  valor: EstadoActivo
  etiqueta: string
  variante: 'default' | 'secondary' | 'destructive' | 'outline'
  clase: string
}[] = [
  {
    valor: 'activo',
    etiqueta: 'Activo',
    variante: 'default',
    clase: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
  },
  {
    valor: 'desasignado',
    etiqueta: 'Desasignado',
    variante: 'secondary',
    clase: 'bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-400',
  },
  {
    valor: 'listo_para_entregar',
    etiqueta: 'Listo para entregar',
    variante: 'outline',
    clase: 'bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400',
  },
  {
    valor: 'en_reparacion',
    etiqueta: 'En reparación',
    variante: 'outline',
    clase: 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400',
  },
  {
    valor: 'retirado',
    etiqueta: 'Retirado',
    variante: 'destructive',
    clase: 'bg-red-500/15 text-red-700 border-red-500/30 dark:text-red-400',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function obtenerConfigEstado(estado: EstadoActivo) {
  return ESTADOS_ACTIVO.find((e) => e.valor === estado) ?? ESTADOS_ACTIVO[1]
}

export function obtenerConfigTipo(tipo: TipoActivo) {
  return TIPOS_ACTIVO.find((t) => t.valor === tipo) ?? TIPOS_ACTIVO[0]
}

// ---------------------------------------------------------------------------
// Rutas de navegación
// ---------------------------------------------------------------------------

export const RUTAS = {
  inicio: '/',
  activos: '/activos',
  nuevoActivo: '/activos/nuevo',
  detalleActivo: (id: string) => `/activos/${id}`,
  usuarios: '/usuarios',
  nuevoUsuario: '/usuarios/nuevo',
  detalleUsuario: (id: string) => `/usuarios/${id}`,
  asignaciones: '/asignaciones',
  mantenimiento: '/mantenimiento',
  reportes: '/reportes',
  login: '/auth/login',
} as const

// ---------------------------------------------------------------------------
// Paginación por defecto
// ---------------------------------------------------------------------------

export const ITEMS_POR_PAGINA = 20
