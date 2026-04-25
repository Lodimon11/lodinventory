'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { UsuarioConCantidadActivos } from '@/types'

interface FiltrosUsuariosProps {
  usuarios: UsuarioConCantidadActivos[]
  onChange: (filtrados: UsuarioConCantidadActivos[]) => void
}

export function FiltrosUsuarios({ usuarios, onChange }: FiltrosUsuariosProps) {
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const filtrados = usuarios.filter((u) => {
      const termino = busqueda.toLowerCase()
      return (
        u.nombre_completo.toLowerCase().includes(termino) ||
        u.email.toLowerCase().includes(termino) ||
        (u.departamento && u.departamento.toLowerCase().includes(termino))
      )
    })
    onChange(filtrados)
  }, [usuarios, busqueda, onChange])

  return (
    <div className="mb-6 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, correo o departamento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
