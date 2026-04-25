// =============================================================================
// src/components/comunes/InsigniaEstado.tsx
// Badge coloreado según el estado del activo
// =============================================================================

import { Badge } from '@/components/ui/badge'
import { obtenerConfigEstado } from '@/constantes'
import type { EstadoActivo } from '@/tipos'
import { cn } from '@/lib/utils'

const COLORES_ESTADO: Record<string, string> = {
  activo: 'bg-[#01C38D] hover:bg-[#01C38D]/80 text-[#191E29]',
  desasignado: 'bg-[#696E79] hover:bg-[#696E79]/80 text-white',
  listo_para_entregar: 'bg-[#5ba3d4] hover:bg-[#5ba3d4]/80 text-[#191E29]',
  en_reparacion: 'bg-[#f59e0b] hover:bg-[#f59e0b]/80 text-[#191E29]',
  retirado: 'bg-[#ef4444] hover:bg-[#ef4444]/80 text-white',
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
