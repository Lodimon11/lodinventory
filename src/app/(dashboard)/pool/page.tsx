import { obtenerActivosPool } from '@/actions/activos'
import { TarjetaPool } from '@/components/pool/TarjetaPool'
import { AlertCircle, Package } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Activo } from '@/types'

export default async function PaginaPool() {
  const { activos, error } = await obtenerActivosPool()

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Hubo un problema al cargar el pool de equipos: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Agrupar activos por estado
  const agrupados = activos.reduce((acc, activo) => {
    if (!acc[activo.estado]) acc[activo.estado] = []
    acc[activo.estado].push(activo)
    return acc
  }, {} as Record<string, Activo[]>)

  const desasignados = agrupados['desasignado'] || []
  const listos = agrupados['listo_para_entregar'] || []
  const enReparacion = agrupados['en_reparacion'] || []
  const retirados = agrupados['retirado'] || []

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pool de Equipos</h1>
        <p className="text-muted-foreground mt-1">
          Gestión de activos no asignados, reparaciones y retiros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Columna: Desasignado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400" />
              Desasignado
            </h2>
            <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">{desasignados.length}</span>
          </div>
          <div className="space-y-3">
            {desasignados.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Vacío</p>
            ) : (
              desasignados.map(a => <TarjetaPool key={a.id} activo={a} />)
            )}
          </div>
        </div>

        {/* Columna: Listo para entregar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-blue-200 pb-2">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Listos
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full font-medium">{listos.length}</span>
          </div>
          <div className="space-y-3">
            {listos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Vacío</p>
            ) : (
              listos.map(a => <TarjetaPool key={a.id} activo={a} />)
            )}
          </div>
        </div>

        {/* Columna: En reparación */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-yellow-200 pb-2">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              En Reparación
            </h2>
            <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">{enReparacion.length}</span>
          </div>
          <div className="space-y-3">
            {enReparacion.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Vacío</p>
            ) : (
              enReparacion.map(a => <TarjetaPool key={a.id} activo={a} />)
            )}
          </div>
        </div>

        {/* Columna: Retirado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-red-200 pb-2">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Retirados
            </h2>
            <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full font-medium">{retirados.length}</span>
          </div>
          <div className="space-y-3">
            {retirados.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Vacío</p>
            ) : (
              retirados.map(a => <TarjetaPool key={a.id} activo={a} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
