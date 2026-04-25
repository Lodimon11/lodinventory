import { obtenerUsuarioPorId, obtenerActivosDisponibles, obtenerAsignacionesPorUsuario } from '@/actions/usuarios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Briefcase, Mail, Monitor, User as UserIcon, Clock, Edit } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { BotonAsignar } from '@/components/usuarios/BotonAsignar'
import { BotonDesasignar } from '@/components/usuarios/BotonDesasignar'

export default async function DetalleUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolucionParams = await params
  const { usuario, error: errorUsuario } = await obtenerUsuarioPorId(resolucionParams.id)

  if (errorUsuario || !usuario) {
    notFound()
  }

  const [
    { vigentes, historial },
    { activos: disponibles }
  ] = await Promise.all([
    obtenerAsignacionesPorUsuario(resolucionParams.id),
    obtenerActivosDisponibles()
  ])

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header y Datos del Usuario */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-primary" />
            {usuario.nombre_completo}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1 text-sm">
              <Mail className="w-4 h-4" />
              {usuario.email}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Building2 className="w-4 h-4" />
              {usuario.departamento || 'Sin departamento'}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Briefcase className="w-4 h-4" />
              {usuario.cargo || 'Sin cargo'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BotonAsignar usuarioId={usuario.id} activosDisponibles={disponibles} />
          <Link href={`/usuarios/${usuario.id}/editar`} className={buttonVariants({ variant: 'outline', className: 'gap-2' })}>
            <Edit className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* 2. Equipos Asignados Actualmente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Monitor className="w-5 h-5" />
            Equipos en uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vigentes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {vigentes.map(asignacion => (
                <div key={asignacion.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/activos/${asignacion.activo.id}`} className="font-semibold hover:underline">
                        {asignacion.activo.etiqueta}
                      </Link>
                      <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">
                        {asignacion.activo.tipo}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Asignado el: {new Date(asignacion.asignado_en).toLocaleDateString('es-AR')}
                      {asignacion.notas && ` • Notas: ${asignacion.notas}`}
                    </div>
                  </div>
                  <BotonDesasignar asignacionId={asignacion.id} etiquetaActivo={asignacion.activo.etiqueta} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Sin equipo asignado actualmente.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Historial de asignaciones pasadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Historial de Devoluciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historial.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hasta</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <Link href={`/activos/${h.activo.id}`} className="font-medium hover:underline">
                        {h.activo.etiqueta}
                      </Link>
                      <div className="text-xs text-muted-foreground capitalize">{h.activo.tipo}</div>
                    </TableCell>
                    <TableCell>{new Date(h.asignado_en).toLocaleDateString('es-AR')}</TableCell>
                    <TableCell>{h.desasignado_en ? new Date(h.desasignado_en).toLocaleDateString('es-AR') : '-'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                      {h.notas || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay historial de equipos devueltos.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
