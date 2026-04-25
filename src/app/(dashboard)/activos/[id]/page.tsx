import { 
  obtenerActivoPorId, 
  obtenerAsignacionVigente, 
  obtenerHistorialAsignaciones, 
  obtenerMantenimientos 
} from '@/actions/activos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Laptop, Monitor, Smartphone, Fingerprint, Calendar, User, Wrench, Clock, Edit } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { FormularioMantenimiento } from '@/components/activos/FormularioMantenimiento'
import { AsignacionConUsuario, Mantenimiento } from '@/types'

const ICONOS_TIPO: Record<string, React.ElementType> = {
  notebook: Laptop,
  escritorio: Monitor,
  telefono: Smartphone,
}

const COLORES_ESTADO: Record<string, string> = {
  activo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  desasignado: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200',
  listo_para_entregar: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  en_reparacion: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
  retirado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  activo: 'Activo',
  desasignado: 'Desasignado',
  listo_para_entregar: 'Listo para entregar',
  en_reparacion: 'En reparación',
  retirado: 'Retirado',
}

const CLAVES_COMPONENTES: Record<string, string> = {
  ram_gb: 'RAM (GB)',
  ssd_gb: 'Disco Estado Sólido (GB)',
  cpu: 'Procesador',
  pantalla: 'Pantalla',
  monitor: 'Monitor',
  modelo: 'Modelo',
  almacenamiento_gb: 'Almacenamiento Total (GB)'
}

export default async function DetalleActivoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolucionParams = await params
  const { activo, error: errorActivo } = await obtenerActivoPorId(resolucionParams.id)

  if (errorActivo || !activo) {
    notFound()
  }

  const [
    { asignacion },
    { historial },
    { mantenimientos }
  ] = await Promise.all([
    obtenerAsignacionVigente(resolucionParams.id),
    obtenerHistorialAsignaciones(resolucionParams.id),
    obtenerMantenimientos(resolucionParams.id)
  ])

  const Icono = ICONOS_TIPO[activo.tipo] || Monitor

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header del Activo */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Icono className="w-8 h-8 text-primary" />
            {activo.etiqueta}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="capitalize font-medium text-foreground">{activo.tipo}</span>
            <span className="flex items-center gap-1 text-sm">
              <Fingerprint className="w-4 h-4" />
              {activo.direccion_mac || 'Sin MAC'}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Calendar className="w-4 h-4" />
              Registrado: {new Date(activo.creado_en).toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`text-sm px-3 py-1 ${COLORES_ESTADO[activo.estado]}`}>
            {ETIQUETAS_ESTADO[activo.estado]}
          </Badge>
          <Link href={`/activos/${activo.id}/editar`} className={buttonVariants({ variant: 'outline', className: 'gap-2' })}>
            <Edit className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Especificaciones / Componentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Laptop className="w-5 h-5" />
              Especificaciones Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(activo.componentes || {}).length > 0 ? (
              <div className="divide-y border rounded-md">
                {Object.entries(activo.componentes).map(([clave, valor]) => (
                  <div key={clave} className="flex justify-between p-3 text-sm">
                    <span className="font-medium text-muted-foreground">
                      {CLAVES_COMPONENTES[clave] || clave}
                    </span>
                    <span className="font-semibold text-right">{String(valor)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay especificaciones registradas.</p>
            )}
          </CardContent>
        </Card>

        {/* 3. Asignación Vigente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Asignación Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {asignacion ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Usuario</p>
                  <p className="font-semibold text-lg">{asignacion.usuario.nombre_completo}</p>
                  <p className="text-sm text-primary">{asignacion.usuario.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Departamento</p>
                    <p className="text-sm font-medium">{asignacion.usuario.departamento || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Desde</p>
                    <p className="text-sm font-medium">{new Date(asignacion.asignado_en).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mb-2 opacity-20" />
                <p>Sin asignación vigente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Historial de asignaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Historial de Asignaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historial && historial.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hasta</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((h: AsignacionConUsuario) => (
                  <TableRow key={h.id}>
                    <TableCell>{new Date(h.asignado_en).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>{h.desasignado_en ? new Date(h.desasignado_en).toLocaleDateString('es-AR') : 'Actual'}</TableCell>
                    <TableCell>
                      <div className="font-medium">{h.usuario.nombre_completo}</div>
                      <div className="text-xs text-muted-foreground">{h.usuario.email}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {h.notas || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay historial de asignaciones.</p>
          )}
        </CardContent>
      </Card>

      {/* 5. Mantenimientos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="w-5 h-5" />
            Registro de Mantenimientos
          </CardTitle>
          <FormularioMantenimiento activoId={activo.id} />
        </CardHeader>
        <CardContent>
          {mantenimientos && mantenimientos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mantenimientos.map((m: Mantenimiento) => (
                  <TableRow key={m.id}>
                    <TableCell>{new Date(m.fecha).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>{m.descripcion}</TableCell>
                    <TableCell className="text-right font-medium">
                      {m.costo ? `$ ${Number(m.costo).toLocaleString('es-AR')}` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay mantenimientos registrados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
