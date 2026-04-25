import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TarjetaResumenProps {
  titulo: string
  valor: number | string
  icono: React.ElementType
  descripcion?: string
  className?: string
  colorIcono?: string
}

export function TarjetaResumen({
  titulo,
  valor,
  icono: Icono,
  descripcion,
  className,
  colorIcono = 'text-primary',
}: TarjetaResumenProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        <div className={cn('p-2.5 rounded-md bg-muted/50', colorIcono)}>
          <Icono className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        {descripcion && (
          <p className="text-xs text-muted-foreground mt-1">{descripcion}</p>
        )}
      </CardContent>
    </Card>
  )
}
