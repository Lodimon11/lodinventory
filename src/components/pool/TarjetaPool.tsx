import { Activo } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Laptop, Monitor, Smartphone, Fingerprint } from 'lucide-react'
import Link from 'next/link'
import { SelectorEstado } from './SelectorEstado'
import { FormularioMantenimiento } from '@/components/activos/FormularioMantenimiento'

const ICONOS_TIPO: Record<string, React.ElementType> = {
  notebook: Laptop,
  escritorio: Monitor,
  telefono: Smartphone,
}

export function TarjetaPool({ activo }: { activo: Activo }) {
  const Icono = ICONOS_TIPO[activo.tipo] || Monitor

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded-md shrink-0">
            <Icono className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/activos/${activo.id}`} className="font-semibold truncate block hover:underline">
              {activo.etiqueta}
            </Link>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Fingerprint className="w-3 h-3" />
              <span className="truncate">{activo.direccion_mac || 'Sin MAC'}</span>
            </div>
            <div className="text-xs text-muted-foreground capitalize mt-0.5">
              {activo.tipo}
            </div>
          </div>
        </div>
        <SelectorEstado activoId={activo.id} estadoActual={activo.estado} etiqueta={activo.etiqueta} />
        {activo.estado === 'en_reparacion' && (
          <div className="mt-2">
            <FormularioMantenimiento 
              activoId={activo.id} 
              textoBoton="Registrar reparación" 
              classNameBoton="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
