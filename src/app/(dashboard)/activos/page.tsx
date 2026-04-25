import { obtenerActivos } from '@/actions/activos'
import { AlertCircle, PlusCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VistaActivosCliente } from '@/components/activos/VistaActivosCliente'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function PaginaActivos() {
  const { activos, error } = await obtenerActivos()

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Hubo un problema al cargar los activos: {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activos</h1>
          <p className="text-muted-foreground mt-1">
            Catálogo completo de dispositivos registrados en el inventario.
          </p>
        </div>
        <Link href="/activos/nuevo" className={buttonVariants({ className: 'gap-2' })}>
          <PlusCircle className="w-4 h-4" />
          Nuevo activo
        </Link>
      </div>
      {activos.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          No hay activos registrados en el sistema.
        </div>
      ) : (
        <VistaActivosCliente activosIniciales={activos} />
      )}
    </div>
  )
}
