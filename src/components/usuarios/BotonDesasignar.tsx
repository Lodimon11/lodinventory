'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DialogConfirmacion } from '@/components/ui/DialogConfirmacion'
import { Textarea } from '@/components/ui/textarea'
import { ejecutarDesasignacion } from '@/actions/usuarios'
import { toast } from 'sonner'
import { MinusCircle, Loader2 } from 'lucide-react'

interface BotonDesasignarProps {
  asignacionId: string
  etiquetaActivo: string
}

export function BotonDesasignar({ asignacionId, etiquetaActivo }: BotonDesasignarProps) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [notas, setNotas] = useState('')
  const router = useRouter()

  async function manejarDesasignacion() {
    setCargando(true)
    const { error } = await ejecutarDesasignacion(asignacionId, notas)
    setCargando(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Equipo desasignado correctamente')
      setAbierto(false)
      setNotas('')
      router.refresh()
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" className="gap-2" onClick={() => setAbierto(true)}>
        <MinusCircle className="w-4 h-4" />
        Desasignar
      </Button>

      <DialogConfirmacion
        abierto={abierto}
        onCancelar={() => {
          setAbierto(false)
          setNotas('')
        }}
        onConfirmar={manejarDesasignacion}
        titulo={`¿Desasignar ${etiquetaActivo}?`}
        descripcion="El equipo volverá al pool como desasignado."
        textoConfirmar="Confirmar devolución"
        variante="destructive"
        cargando={cargando}
      >
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Notas de devolución (opcional)</label>
          <Textarea 
            placeholder="Estado en el que se devuelve el equipo..." 
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            disabled={cargando}
          />
        </div>
      </DialogConfirmacion>
    </>
  )
}
