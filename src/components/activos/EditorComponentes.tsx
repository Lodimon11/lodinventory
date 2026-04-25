'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'

interface FilaComponente {
  id: string
  clave: string
  clavePersonalizada: string
  valor: string
}

const OPCIONES_CLAVE = [
  { value: 'ram_gb', label: 'RAM (GB)' },
  { value: 'ssd_gb', label: 'Disco Estado Sólido (GB)' },
  { value: 'cpu', label: 'Procesador' },
  { value: 'pantalla', label: 'Pantalla' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'modelo', label: 'Modelo' },
  { value: 'almacenamiento_gb', label: 'Almacenamiento Total (GB)' },
  { value: 'otros', label: 'Otros (Personalizado)' },
]

interface EditorComponentesProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function EditorComponentes({ value, onChange, disabled }: EditorComponentesProps) {
  const [filas, setFilas] = useState<FilaComponente[]>([])
  const [inicializado, setInicializado] = useState(false)

  // Inicializar filas a partir del JSON (solo la primera vez)
  useEffect(() => {
    if (inicializado) return
    
    try {
      if (!value || value === '{}') {
        setFilas([])
      } else {
        const parsed = JSON.parse(value)
        const nuevasFilas = Object.entries(parsed).map(([k, v]) => {
          const esPredefinida = OPCIONES_CLAVE.some(op => op.value === k && k !== 'otros')
          return {
            id: Math.random().toString(36).substring(7),
            clave: esPredefinida ? k : 'otros',
            clavePersonalizada: esPredefinida ? '' : k,
            valor: String(v)
          }
        })
        setFilas(nuevasFilas)
      }
    } catch {
      // JSON inválido, iniciar vacío
      setFilas([])
    } finally {
      setInicializado(true)
    }
  }, [value, inicializado])

  const manejarCambioFilas = (nuevasFilas: FilaComponente[]) => {
    setFilas(nuevasFilas)
    
    const obj: Record<string, string> = {}
    nuevasFilas.forEach(fila => {
      const claveFinal = fila.clave === 'otros' ? fila.clavePersonalizada.trim() : fila.clave
      // Solo incluimos campos que tengan una clave y no estén completamente vacíos en valor
      if (claveFinal && fila.valor.trim() !== '') {
        obj[claveFinal] = fila.valor.trim()
      }
    })
    
    onChange(JSON.stringify(obj, null, 2))
  }

  const agregarFila = () => {
    manejarCambioFilas([
      ...filas, 
      { id: Math.random().toString(36).substring(7), clave: 'ram_gb', clavePersonalizada: '', valor: '' }
    ])
  }

  const eliminarFila = (id: string) => {
    manejarCambioFilas(filas.filter(f => f.id !== id))
  }

  const actualizarFila = (id: string, campo: keyof FilaComponente, nuevoValor: string) => {
    manejarCambioFilas(filas.map(f => f.id === id ? { ...f, [campo]: nuevoValor } : f))
  }

  return (
    <div className="space-y-3">
      {filas.map((fila) => (
        <div key={fila.id} className="flex items-center gap-2">
          <Select 
            value={fila.clave} 
            onValueChange={(val) => actualizarFila(fila.id, 'clave', val || '')}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
            <SelectContent>
              {OPCIONES_CLAVE.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fila.clave === 'otros' && (
            <Input 
              placeholder="Nombre de componente..." 
              value={fila.clavePersonalizada}
              onChange={(e) => actualizarFila(fila.id, 'clavePersonalizada', e.target.value)}
              className="w-[200px]"
              disabled={disabled}
            />
          )}

          <Input 
            placeholder="Valor (ej. 16, i7, 1080p)..." 
            value={fila.valor}
            onChange={(e) => actualizarFila(fila.id, 'valor', e.target.value)}
            className="flex-1"
            disabled={disabled}
          />

          <Button type="button" variant="ghost" size="icon" onClick={() => eliminarFila(fila.id)} disabled={disabled}>
            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      ))}
      
      {filas.length === 0 && (
        <div className="text-sm text-muted-foreground italic py-2 px-1 border border-dashed rounded-md text-center">
          No hay componentes agregados.
        </div>
      )}

      <Button type="button" variant="outline" size="sm" onClick={agregarFila} className="gap-2" disabled={disabled}>
        <Plus className="w-4 h-4" />
        Agregar componente
      </Button>
    </div>
  )
}
