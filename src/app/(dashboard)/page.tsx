import { obtenerMetricas, obtenerUltimasAsignaciones, obtenerActivosEnReparacion } from '@/actions/activos'
import { TarjetaMetrica } from '@/components/dashboard/TarjetaMetrica'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Monitor, CheckCircle2, Wrench, PackageSearch, AlertCircle, Laptop, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { BotonExportar } from '@/components/dashboard/BotonExportar'

const ICONOS_TIPO: Record<string, React.ElementType> = {
  notebook: Laptop,
  escritorio: Monitor,
  telefono: Smartphone,
}

export default async function DashboardPage() {
  const [
    { metricas, error: errorMetricas },
    { asignaciones: ultimasAsignaciones },
    { activos: activosEnReparacion }
  ] = await Promise.all([
    obtenerMetricas(),
    obtenerUltimasAsignaciones(5),
    obtenerActivosEnReparacion()
  ])

  if (errorMetricas) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar el dashboard</AlertTitle>
          <AlertDescription>{errorMetricas}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del inventario y estado actual de los equipos.
          </p>
        </div>
        <BotonExportar />
      </div>

      {/* 1. Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaMetrica 
          titulo="Total de Activos" 
          valor={metricas.total} 
          icono={Monitor} 
          colorIcono="text-primary"
        />
        <TarjetaMetrica 
          titulo="Activos Asignados" 
          valor={metricas.asignados} 
          icono={CheckCircle2} 
          colorIcono="text-green-500"
          descripcion="Equipos en uso actualmente"
        />
        <TarjetaMetrica 
          titulo="En Reparación" 
          valor={metricas.enReparacion} 
          icono={Wrench} 
          colorIcono="text-yellow-500"
          descripcion="Requieren atención técnica"
        />
        <TarjetaMetrica 
          titulo="Disponibles" 
          valor={metricas.disponibles} 
          icono={PackageSearch} 
          colorIcono="text-blue-500"
          descripcion="Listos para ser entregados"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Últimas asignaciones (Ocupa 2/3 del espacio) */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Últimas Asignaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimasAsignaciones && ultimasAsignaciones.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha de Asignación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ultimasAsignaciones.map((asignacion) => (
                    <TableRow key={asignacion.id}>
                      <TableCell>
                        <Link href={`/activos/${asignacion.activo_id}`} className="font-medium hover:underline">
                          {asignacion.activo.etiqueta}
                        </Link>
                        <div className="text-xs text-muted-foreground capitalize">
                          {asignacion.activo.tipo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/usuarios/${asignacion.usuario_id}`} className="font-medium hover:underline">
                          {asignacion.usuario.nombre_completo}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {asignacion.usuario.departamento || 'Sin departamento'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(asignacion.asignado_en).toLocaleDateString('es-AR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm border rounded-lg bg-muted/20">
                Aún no se han registrado asignaciones.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Equipos en reparación (Ocupa 1/3 del espacio) */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="w-5 h-5 text-yellow-500" />
              Equipos en Reparación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activosEnReparacion && activosEnReparacion.length > 0 ? (
              <div className="space-y-4">
                {activosEnReparacion.map((activo) => {
                  const Icono = ICONOS_TIPO[activo.tipo] || Monitor
                  return (
                    <div key={activo.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icono className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Link href={`/activos/${activo.id}`} className="font-semibold text-sm hover:underline">
                            {activo.etiqueta}
                          </Link>
                          <div className="text-xs text-muted-foreground capitalize">
                            {activo.tipo}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg bg-muted/20">
                No hay equipos en reparación actualmente.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
