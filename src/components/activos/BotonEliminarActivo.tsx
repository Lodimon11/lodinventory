'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DialogConfirmacion } from '@/components/ui/DialogConfirmacion'
import { eliminarActivo } from '@/actions/activos'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface BotonEliminarActivoProps {
  id: string
  etiqueta: string
}

export function BotonEliminarActivo({ id, etiqueta }: BotonEliminarActivoProps) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  async function manejarEliminacion() {
    setCargando(true)
    const { error } = await eliminarActivo(id)
    setCargando(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Activo eliminado correctamente')
      setAbierto(false)
      router.push('/activos')
      router.refresh()
    }
  }

  return (
    <>
      <Button variant="destructive" className="gap-2" onClick={() => setAbierto(true)}>
        <Trash2 className="w-4 h-4" />
        Eliminar activo
      </Button>

      <DialogConfirmacion
        abierto={abierto}
        onCancelar={() => setAbierto(false)}
        onConfirmar={manejarEliminacion}
        titulo={`¿Eliminar activo ${etiqueta}?`}
        descripcion="Esta acción eliminará permanentemente el equipo y todo su historial de asignaciones y mantenimientos. Esta acción no se puede deshacer."
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar permanentemente"
        variante="destructive"
        cargando={cargando}
      />
    </>
  )
}
