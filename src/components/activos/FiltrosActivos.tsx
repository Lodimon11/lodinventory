'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Activo } from '@/types'
import { Search } from 'lucide-react'

interface FiltrosActivosProps {
  activos: Activo[]
  onChange: (filtrados: Activo[]) => void
}

export function FiltrosActivos({ activos, onChange }: FiltrosActivosProps) {
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [estado, setEstado] = useState('todos')

  useEffect(() => {
    const filtrados = activos.filter((activo) => {
      const matchBusqueda = 
        activo.etiqueta.toLowerCase().includes(busqueda.toLowerCase()) || 
        (activo.direccion_mac && activo.direccion_mac.toLowerCase().includes(busqueda.toLowerCase()))
      
      const matchTipo = tipo === 'todos' || activo.tipo === tipo
      const matchEstado = estado === 'todos' || activo.estado === estado

      return matchBusqueda && matchTipo && matchEstado
    })

    onChange(filtrados)
  }, [activos, busqueda, tipo, estado, onChange])

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por etiqueta o MAC..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={tipo} onValueChange={(val) => setTipo(val || 'todos')}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los tipos</SelectItem>
          <SelectItem value="notebook">Notebook</SelectItem>
          <SelectItem value="escritorio">Escritorio</SelectItem>
          <SelectItem value="telefono">Teléfono</SelectItem>
        </SelectContent>
      </Select>
      <Select value={estado} onValueChange={(val) => setEstado(val || 'todos')}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="activo">Activo</SelectItem>
          <SelectItem value="desasignado">Desasignado</SelectItem>
          <SelectItem value="listo_para_entregar">Listo para entregar</SelectItem>
          <SelectItem value="en_reparacion">En reparación</SelectItem>
          <SelectItem value="retirado">Retirado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
