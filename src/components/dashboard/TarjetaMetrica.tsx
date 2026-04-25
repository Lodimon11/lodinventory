import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface TarjetaMetricaProps {
  titulo: string
  valor: number
  icono: LucideIcon
  colorIcono: string
  descripcion?: string
}

export function TarjetaMetrica({ titulo, valor, icono: Icono, colorIcono, descripcion }: TarjetaMetricaProps) {
  const colorMap: Record<string, { border: string, bg: string, text: string }> = {
    'text-primary': { border: 'border-l-[#6B8FD4]', bg: 'bg-[rgba(107,143,212,0.12)]', text: 'text-[#6B8FD4]' },
    'text-green-500': { border: 'border-l-[#01C38D]', bg: 'bg-[rgba(1,195,141,0.12)]', text: 'text-[#01C38D]' },
    'text-yellow-500': { border: 'border-l-[#d4a843]', bg: 'bg-[rgba(212,168,67,0.12)]', text: 'text-[#d4a843]' },
    'text-blue-500': { border: 'border-l-[#6B8FD4]', bg: 'bg-[rgba(107,143,212,0.12)]', text: 'text-[#6B8FD4]' },
  }
  
  const colorStyle = colorMap[colorIcono] || colorMap['text-primary']

  return (
    <Card className={`relative overflow-hidden shadow-sm dark:shadow-none border-l-[3px] ${colorStyle.border} hover:-translate-y-[2px] transition-all duration-300 animate-fade-in-up group`}>
      {/* Fondo con opacidad extra */}
      <div className={`absolute inset-0 ${colorStyle.bg} opacity-20 -z-10`} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 relative z-10">
        <CardTitle className="heading-sm text-muted-foreground font-medium">
          {titulo}
        </CardTitle>
        <div className={`p-2 rounded-full ${colorStyle.bg} transition-colors duration-300`}>
          <Icono className={`w-4 h-4 ${colorStyle.text}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-[3rem] leading-none tracking-tight font-heading font-bold text-[var(--acento-verde)]">
          {valor}
        </div>
        {descripcion && (
          <p className="body-text text-[var(--texto-secundario)] mt-3 pt-3 border-t border-border/20">
            {descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
