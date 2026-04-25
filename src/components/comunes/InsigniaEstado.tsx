// =============================================================================
// src/components/comunes/InsigniaEstado.tsx
// Badge coloreado según el estado del activo
// =============================================================================

import { Badge } from '@/components/ui/badge'
import { obtenerConfigEstado } from '@/constantes'
import type { EstadoActivo } from '@/tipos'
import { cn } from '@/lib/utils'

const COLORES_ESTADO: Record<string, string> = {
  activo: 'border-transparent text-[#01C38D] bg-[rgba(1,195,141,0.12)] font-medium',
  desasignado: 'border-transparent text-[#696E79] bg-muted/50 font-medium',
  listo_para_entregar: 'border-transparent text-[#6B8FD4] bg-[rgba(107,143,212,0.12)] font-medium',
  en_reparacion: 'border-transparent text-[#d4a843] bg-[rgba(212,168,67,0.12)] font-medium',
  retirado: 'border-transparent text-[#ef4444] bg-[rgba(239,68,68,0.12)] font-medium',
}

interface InsigniaEstadoProps {
  estado: EstadoActivo
  className?: string
}

export function InsigniaEstado({ estado, className }: InsigniaEstadoProps) {
  const config = obtenerConfigEstado(estado)

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium border', COLORES_ESTADO[estado] || config.clase, className)}
    >
      {config.etiqueta}
    </Badge>
  )
}
