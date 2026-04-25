import { Activo } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Laptop, Monitor, Smartphone, Fingerprint } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const ICONOS_TIPO = {
  notebook: Laptop,
  escritorio: Monitor,
  telefono: Smartphone,
}

const COLORES_ESTADO = {
  activo: 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  desasignado: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  listo_para_entregar: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  en_reparacion: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  retirado: 'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
}

const ETIQUETAS_ESTADO = {
  activo: 'Activo',
  desasignado: 'Desasignado',
  listo_para_entregar: 'Listo para entregar',
  en_reparacion: 'En reparación',
  retirado: 'Retirado',
}

export function ActivoTarjeta({ activo }: { activo: Activo }) {
  const Icono = ICONOS_TIPO[activo.tipo] || Monitor

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Icono className="w-5 h-5 text-muted-foreground" />
            {activo.etiqueta}
          </CardTitle>
          <Badge variant="outline" className={COLORES_ESTADO[activo.estado]}>
            {ETIQUETAS_ESTADO[activo.estado]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            <span className="font-mono text-xs">{activo.direccion_mac || 'Sin MAC'}</span>
          </div>
          <div className="capitalize mt-2">
            Tipo: {activo.tipo}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <Link 
          href={`/activos/${activo.id}`} 
          className={buttonVariants({ variant: 'secondary', className: 'w-full' })}
        >
          Ver detalle
        </Link>
      </CardFooter>
    </Card>
  )
}
