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
  return (
    <Card className="relative overflow-hidden shadow-sm dark:shadow-none border-l-[3px] border-l-primary bg-primary/5 hover:-translate-y-[2px] transition-all duration-300 animate-fade-in-up group">
      {/* Fondo con opacidad extra (opcional si ya usamos bg-primary/5) */}
      <div className="absolute inset-0 bg-card/80 dark:bg-card/90 -z-10" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 relative z-10">
        <CardTitle className="heading-sm text-muted-foreground/80 font-medium">
          {titulo}
        </CardTitle>
        <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
          <Icono className={`w-4 h-4 text-primary ${colorIcono}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-[3rem] leading-none tracking-tight font-heading font-semibold text-foreground">
          {valor}
        </div>
        {descripcion && (
          <p className="body-text text-muted-foreground mt-3 pt-3 border-t border-border/30">
            {descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
