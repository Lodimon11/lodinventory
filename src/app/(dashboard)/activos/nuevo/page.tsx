import { FormularioActivo } from '@/components/activos/FormularioActivo'
import { PackagePlus } from 'lucide-react'

export default function PaginaNuevoActivo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <PackagePlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Activo</h1>
          <p className="text-muted-foreground text-sm">
            Ingresa los detalles del nuevo equipo al inventario.
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <FormularioActivo />
      </div>
    </div>
  )
}
