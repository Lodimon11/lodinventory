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
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
        <Icono className={`w-4 h-4 ${colorIcono}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        {descripcion && (
          <p className="text-xs text-muted-foreground mt-1">
            {descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
