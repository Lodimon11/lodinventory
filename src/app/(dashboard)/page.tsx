import { obtenerMetricas, obtenerUltimasAsignaciones, obtenerActivosEnReparacion } from '@/actions/activos'
import { TarjetaMetrica } from '@/components/dashboard/TarjetaMetrica'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Monitor, CheckCircle2, Wrench, PackageSearch, AlertCircle, Laptop, Smartphone, ArrowRight, CalendarDays, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { BotonExportar } from '@/components/dashboard/BotonExportar'
import { Button } from '@/components/ui/button'

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
        <Alert variant="destructive" className="neo-card bg-red-500/10 border-red-500/20 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar el dashboard</AlertTitle>
          <AlertDescription>{errorMetricas}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Banner */}
      <div className="neo-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-5 md:p-6 border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            ¡Bienvenido de nuevo! <span className="text-2xl inline-block origin-bottom-right hover:animate-pulse">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">
            Resumen general del inventario y estado actual de los equipos.
          </p>
        </div>
        <div className="relative z-10 mt-4 md:mt-0 flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 border border-white/5 backdrop-blur-md shadow-inner">
            <BarChart2 className="w-5 h-5 text-primary opacity-80" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot"></span>
                <span className="text-[10px] text-primary font-bold tracking-wider uppercase leading-none mt-0.5">Sistema Activo</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 leading-none">Sincronizado</span>
            </div>
          </div>
          <BotonExportar />
        </div>
      </div>

      {/* 1. Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TarjetaMetrica 
          titulo="Total de Activos" 
          valor={metricas.total} 
          icono={Monitor} 
          colorIcono="text-primary"
          trend={{ value: 5, type: 'up' }}
          descripcion="Equipos registrados"
        />
        <TarjetaMetrica 
          titulo="Activos Asignados" 
          valor={metricas.asignados} 
          icono={CheckCircle2} 
          colorIcono="text-green-500"
          trend={{ value: 2, type: 'up' }}
          descripcion="Equipos en uso actualmente"
        />
        <TarjetaMetrica 
          titulo="En Reparación" 
          valor={metricas.enReparacion} 
          icono={Wrench} 
          colorIcono="text-yellow-500"
          trend={{ value: 0, type: 'neutral' }}
          descripcion="Requieren atención técnica"
        />
        <TarjetaMetrica 
          titulo="Disponibles" 
          valor={metricas.disponibles} 
          icono={PackageSearch} 
          colorIcono="text-blue-500"
          trend={{ value: 3, type: 'up' }}
          descripcion="Listos para ser entregados"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 2. Últimas asignaciones (Ocupa 2/3 del espacio) */}
        <Card className="neo-card xl:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              Últimas Asignaciones
            </CardTitle>
            <Button variant="ghost" className="text-sm text-primary hover:text-primary hover:bg-primary/10 transition-colors" render={<Link href="/asignaciones" />}>
              Ver todas <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
            {ultimasAsignaciones && ultimasAsignaciones.length > 0 ? (
              <div className="rounded-xl border border-white/5 overflow-hidden bg-black/20">
                <Table>
                  <TableHeader className="bg-white/5 hover:bg-white/5 border-b border-white/5">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-medium text-muted-foreground h-12">Equipo</TableHead>
                      <TableHead className="font-medium text-muted-foreground h-12">Usuario</TableHead>
                      <TableHead className="font-medium text-muted-foreground h-12 text-right">Fecha de Asignación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ultimasAsignaciones.map((asignacion) => {
                      const Icono = ICONOS_TIPO[asignacion.activo.tipo] || Monitor
                      return (
                        <TableRow key={asignacion.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/5 rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <Icono className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <Link href={`/activos/${asignacion.activo_id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                                  {asignacion.activo.etiqueta}
                                </Link>
                                <span className="text-xs text-muted-foreground capitalize mt-0.5">
                                  {asignacion.activo.tipo}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col">
                              <Link href={`/usuarios/${asignacion.usuario_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                {asignacion.usuario.nombre_completo}
                              </Link>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {asignacion.usuario.departamento || 'Sin departamento'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full">
                              <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                              {new Date(asignacion.asignado_en).toLocaleDateString('es-AR')}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-black/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">Sin asignaciones recientes</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Aún no se han registrado asignaciones en el sistema. Comienza asignando un equipo a un usuario.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. Equipos en reparación (Ocupa 1/3 del espacio) */}
        <Card className="neo-card flex flex-col h-full">
          <CardHeader className="pb-6 border-b border-white/5">
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                  <Wrench className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F59E0B] border-2 border-[var(--fondo-card)] rounded-full"></span>
              </div>
              Equipos en Reparación
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
            {activosEnReparacion && activosEnReparacion.length > 0 ? (
              <div className="space-y-3">
                {activosEnReparacion.map((activo) => {
                  const Icono = ICONOS_TIPO[activo.tipo] || Monitor
                  return (
                    <div key={activo.id} className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/5 rounded-lg text-muted-foreground group-hover:text-[#F59E0B] group-hover:bg-[#F59E0B]/10 transition-colors">
                          <Icono className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <Link href={`/activos/${activo.id}`} className="font-semibold text-foreground hover:text-[#F59E0B] transition-colors">
                            {activo.etiqueta}
                          </Link>
                          <span className="text-xs text-muted-foreground capitalize mt-0.5">
                            {activo.tipo}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#10B981]/20 blur-xl rounded-full"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#10B981]/20 to-transparent rounded-2xl border border-[#10B981]/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay equipos en reparación</h3>
                <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                  ¡Excelente! Todos los equipos están funcionando correctamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
