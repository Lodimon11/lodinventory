import { obtenerActivoPorId } from '@/actions/activos'
import { FormularioActivo } from '@/components/activos/FormularioActivo'
import { Edit } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PaginaEditarActivo({ params }: { params: Promise<{ id: string }> }) {
  const resolucionParams = await params
  const { activo, error } = await obtenerActivoPorId(resolucionParams.id)

  if (error || !activo) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Edit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Activo: {activo.etiqueta}</h1>
          <p className="text-muted-foreground text-sm">
            Modifica las especificaciones o información del equipo.
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <FormularioActivo activo={activo} />
      </div>
    </div>
  )
}
