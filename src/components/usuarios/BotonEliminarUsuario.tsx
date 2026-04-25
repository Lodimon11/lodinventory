'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DialogConfirmacion } from '@/components/ui/DialogConfirmacion'
import { eliminarUsuario } from '@/actions/usuarios'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

interface BotonEliminarUsuarioProps {
  id: string
  nombre: string
}

export function BotonEliminarUsuario({ id, nombre }: BotonEliminarUsuarioProps) {
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  async function manejarEliminacion() {
    setCargando(true)
    const { error } = await eliminarUsuario(id)
    setCargando(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Usuario eliminado correctamente')
      setAbierto(false)
      router.push('/usuarios')
      router.refresh()
    }
  }

  return (
    <>
      <Button variant="destructive" className="gap-2" onClick={() => setAbierto(true)}>
        <Trash2 className="w-4 h-4" />
        Eliminar usuario
      </Button>

      <DialogConfirmacion
        abierto={abierto}
        onCancelar={() => setAbierto(false)}
        onConfirmar={manejarEliminacion}
        titulo={`¿Eliminar usuario ${nombre}?`}
        descripcion="Esta acción eliminará permanentemente al usuario y todo su historial de asignaciones. Si tiene equipos asignados, estos volverán al pool como desasignados."
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar permanentemente"
        variante="destructive"
        cargando={cargando}
      />
    </>
  )
}
