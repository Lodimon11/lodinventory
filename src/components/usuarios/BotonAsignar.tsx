'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Activo } from '@/types'
import { ejecutarAsignacion } from '@/actions/usuarios'
import { toast } from 'sonner'
import { PlusCircle, Loader2 } from 'lucide-react'

interface BotonAsignarProps {
  usuarioId: string
  activosDisponibles: Activo[]
}

export function BotonAsignar({ usuarioId, activosDisponibles }: BotonAsignarProps) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [activoSeleccionado, setActivoSeleccionado] = useState<string>('')
  const [notas, setNotas] = useState('')
  const router = useRouter()

  async function manejarAsignacion() {
    if (!activoSeleccionado) return toast.error('Selecciona un equipo primero')
    
    setCargando(true)
    const { error } = await ejecutarAsignacion(activoSeleccionado, usuarioId, notas)
    setCargando(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Equipo asignado correctamente')
      setAbierto(false)
      setActivoSeleccionado('')
      setNotas('')
      router.refresh() // Forzamos actualización de la página actual
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <PlusCircle className="w-4 h-4" />
        Asignar equipo
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar nuevo equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Equipo disponible</label>
            <Select value={activoSeleccionado} onValueChange={(v) => setActivoSeleccionado(v || '')} disabled={cargando}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {activosDisponibles.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No hay equipos disponibles</div>
                ) : (
                  activosDisponibles.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.etiqueta} - {a.tipo} ({a.estado})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas (opcional)</label>
            <Textarea 
              placeholder="Estado de la entrega, periféricos incluidos..." 
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={cargando}
            />
          </div>
          <Button onClick={manejarAsignacion} className="w-full" disabled={cargando || !activoSeleccionado}>
            {cargando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirmar asignación'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
