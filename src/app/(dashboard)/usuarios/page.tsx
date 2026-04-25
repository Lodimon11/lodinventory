import { obtenerUsuariosConConteo } from '@/actions/usuarios'
import { AlertCircle, UserPlus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VistaUsuariosCliente } from '@/components/usuarios/VistaUsuariosCliente'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function PaginaUsuarios() {
  const { usuarios, error } = await obtenerUsuariosConConteo()

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Hubo un problema al cargar los usuarios: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Directorio del personal y estado de sus equipos asignados.
          </p>
        </div>
        <Link href="/usuarios/nuevo" className={buttonVariants({ className: 'gap-2' })}>
          <UserPlus className="w-4 h-4" />
          Nuevo usuario
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          No hay usuarios registrados en el sistema.
        </div>
      ) : (
        <VistaUsuariosCliente usuariosIniciales={usuarios} />
      )}
    </div>
  )
}
