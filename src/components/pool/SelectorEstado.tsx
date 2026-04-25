'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogConfirmacion } from '@/components/ui/DialogConfirmacion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EstadoActivo } from '@/types'
import { cambiarEstadoActivo } from '@/actions/activos'
import { toast } from 'sonner'
import { ChevronDown, Loader2 } from 'lucide-react'

interface SelectorEstadoProps {
  activoId: string
  estadoActual: EstadoActivo
  etiqueta: string
}

export function SelectorEstado({ activoId, estadoActual, etiqueta }: SelectorEstadoProps) {
  const [cargando, setCargando] = useState(false)
  const [confirmarRetiro, setConfirmarRetiro] = useState(false)

  const manejarCambio = async (nuevoEstado: EstadoActivo) => {
    if (nuevoEstado === estadoActual) return

    if (nuevoEstado === 'retirado' && estadoActual !== 'retirado') {
      setConfirmarRetiro(true)
      return
    }

    ejecutarCambioEstado(nuevoEstado)
  }

  const ejecutarCambioEstado = async (nuevoEstado: EstadoActivo) => {
    setCargando(true)
    const { error } = await cambiarEstadoActivo(activoId, nuevoEstado)
    setCargando(false)
    setConfirmarRetiro(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Estado actualizado correctamente')
    }
  }

  const opciones: { estado: EstadoActivo; label: string; peligro?: boolean }[] = []

  if (estadoActual === 'retirado') {
    opciones.push({ estado: 'desasignado', label: 'Reactivar (Desasignado)' })
  } else {
    if (estadoActual !== 'desasignado') {
      opciones.push({ estado: 'desasignado', label: 'Marcar Desasignado' })
    }
    if (estadoActual !== 'listo_para_entregar') {
      opciones.push({ estado: 'listo_para_entregar', label: 'Marcar Listo para entregar' })
    }
    if (estadoActual !== 'en_reparacion') {
      opciones.push({ estado: 'en_reparacion', label: 'Enviar a Reparación' })
    }
    opciones.push({ estado: 'retirado', label: 'Retirar equipo', peligro: true })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="w-full justify-between mt-2" disabled={cargando} />}>
          {cargando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Cambiar estado...'}
          <ChevronDown className="w-4 h-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {opciones.map((opcion) => (
            <DropdownMenuItem 
              key={opcion.estado} 
              onClick={() => manejarCambio(opcion.estado)}
              className={opcion.peligro ? "text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30" : ""}
            >
              {opcion.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogConfirmacion
        abierto={confirmarRetiro}
        onCancelar={() => setConfirmarRetiro(false)}
        onConfirmar={() => ejecutarCambioEstado('retirado')}
        titulo={`¿Retirar ${etiqueta} del inventario?`}
        descripcion="Esta acción marca el equipo como retirado. Podrás reactivarlo desde el pool."
        textoConfirmar="Retirar equipo"
        variante="destructive"
        cargando={cargando}
      />
    </>
  )
}
