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
    <Card className="relative overflow-hidden shadow-sm dark:shadow-none border border-border/40 hover:border-primary/50 bg-card/50 backdrop-blur-sm hover:-translate-y-[2px] transition-all duration-300 animate-fade-in-up group">
      {/* Micro-borde de acento tipo Linear */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
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
