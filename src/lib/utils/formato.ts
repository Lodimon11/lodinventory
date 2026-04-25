// =============================================================================
// src/lib/utils/formato.ts
// Funciones de formato para fechas, moneda y texto
// =============================================================================

/**
 * Formatea una fecha ISO a formato legible en español argentino.
 * ej. "24 de abril de 2026"
 */
export function formatearFecha(fecha: string | null | undefined): string {
  if (!fecha) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha))
}

/**
 * Formatea una fecha ISO a formato corto.
 * ej. "24/04/2026"
 */
export function formatearFechaCorta(fecha: string | null | undefined): string {
  if (!fecha) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha))
}

/**
 * Formatea fecha y hora.
 * ej. "24/04/2026, 10:35"
 */
export function formatearFechaHora(fecha: string | null | undefined): string {
  if (!fecha) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha))
}

/**
 * Formatea un valor numérico como moneda en pesos argentinos.
 * ej. "$ 15.000,00"
 */
export function formatearMoneda(valor: number | null | undefined): string {
  if (valor == null) return '—'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(valor)
}

/**
 * Trunca un texto a la longitud indicada y agrega "…"
 */
export function truncarTexto(texto: string, largo: number = 40): string {
  if (texto.length <= largo) return texto
  return texto.slice(0, largo) + '…'
}

/**
 * Convierte null/undefined a un string por defecto.
 */
export function valorOGuion(valor: string | null | undefined): string {
  return valor ?? '—'
}
