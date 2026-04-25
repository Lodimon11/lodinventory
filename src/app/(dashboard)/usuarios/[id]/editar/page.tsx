import { obtenerUsuarioPorId } from '@/actions/usuarios'
import { FormularioUsuario } from '@/components/usuarios/FormularioUsuario'
import { Edit } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PaginaEditarUsuario({ params }: { params: Promise<{ id: string }> }) {
  const resolucionParams = await params
  const { usuario, error } = await obtenerUsuarioPorId(resolucionParams.id)

  if (error || !usuario) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Edit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Usuario: {usuario.nombre_completo}</h1>
          <p className="text-muted-foreground text-sm">
            Modifica los detalles e información del colaborador.
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <FormularioUsuario usuario={usuario} />
      </div>
    </div>
  )
}
