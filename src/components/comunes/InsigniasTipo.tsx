// =============================================================================
// src/components/comunes/InsigniasTipo.tsx
// Badge con ícono según el tipo de activo
// =============================================================================

import { Laptop, Monitor, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { TipoActivo } from '@/tipos'
import { cn } from '@/lib/utils'

const configTipo: Record<TipoActivo, { etiqueta: string; Icono: React.ElementType; clase: string }> = {
  notebook: {
    etiqueta: 'Notebook',
    Icono: Laptop,
    clase: 'bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-400',
  },
  escritorio: {
    etiqueta: 'Escritorio',
    Icono: Monitor,
    clase: 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400',
  },
  telefono: {
    etiqueta: 'Teléfono',
    Icono: Smartphone,
    clase: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400',
  },
}

interface InsigniasTipoProps {
  tipo: TipoActivo
  className?: string
}

export function InsigniasTipo({ tipo, className }: InsigniasTipoProps) {
  const { etiqueta, Icono, clase } = configTipo[tipo]

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium border gap-1.5', clase, className)}
    >
      <Icono className="w-3 h-3" />
      {etiqueta}
    </Badge>
  )
}
