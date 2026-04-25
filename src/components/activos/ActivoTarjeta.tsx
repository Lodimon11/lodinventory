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
    <Card className="group flex flex-col h-full shadow-sm dark:shadow-none border border-border/40 hover:border-primary/40 bg-card/40 backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(1,195,141,0.03)] hover:-translate-y-[3px] transition-all duration-300 relative overflow-hidden">
      {/* Micro-borde en hover */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-t-xl border-b border-border/30">
        <div className="flex justify-between items-start">
          <CardTitle className="heading-sm font-semibold flex items-center gap-2.5 text-foreground/90">
            <div className="p-1.5 rounded-md bg-background/50 border border-border/50 shadow-sm">
              <Icono className="w-4 h-4 text-muted-foreground" />
            </div>
            {activo.etiqueta}
          </CardTitle>
          <Badge variant="outline" className={COLORES_ESTADO[activo.estado] + " shadow-sm border-0"}>
            {activo.estado === 'activo' && (
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse-dot" />
            )}
            {ETIQUETAS_ESTADO[activo.estado]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <div className="space-y-3 text-sm text-muted-foreground/80">
          <div className="flex items-center gap-2.5 group-hover:text-foreground/70 transition-colors">
            <Fingerprint className="w-4 h-4 opacity-70" />
            <span className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground/80 border border-border/40">{activo.direccion_mac || 'Sin MAC'}</span>
          </div>
          <div className="capitalize flex items-center gap-2 pt-2">
            <span className="opacity-70">Tipo:</span>
            <span className="text-foreground/90 font-medium">{activo.tipo}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 pb-4 border-t border-border/30 bg-muted/10">
        <Link 
          href={`/activos/${activo.id}`} 
          className={buttonVariants({ variant: 'ghost', className: 'w-full hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all' })}
        >
          Ver detalle
        </Link>
      </CardFooter>
    </Card>
  )
}
