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
    <Card className="shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-none border-l-[3px] border-l-primary hover:-translate-y-[2px] transition-transform duration-200 animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="heading-sm text-muted-foreground">
          {titulo}
        </CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <Icono className={`w-5 h-5 text-primary ${colorIcono}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="heading-xl text-primary">{valor}</div>
        {descripcion && (
          <p className="body-text text-muted-foreground mt-1">
            {descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
