'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { TipoActivo } from '@/types'
import { Label } from '@/components/ui/label'

interface FilaComponente {
  id: string
  clave: string
  clavePersonalizada: string
  valor: string
}

const OPCIONES_CLAVE = [
  { value: 'pantalla', label: 'Pantalla' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'almacenamiento_gb', label: 'Almacenamiento Total (GB)' },
  { value: 'otros', label: 'Otros (Personalizado)' },
]

interface EditorComponentesProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  tipo: TipoActivo
}

export function EditorComponentes({ value, onChange, disabled, tipo }: EditorComponentesProps) {
  const [inicializado, setInicializado] = useState(false)
  
  // Estado para estructurados
  const [estructurado, setEstructurado] = useState<Record<string, any>>({
    marca: '',
    modelo: '',
    cpu: '',
    ram_gb: '',
    ram_tipo: '',
    disco_gb: '',
    disco_tipo: '',
    disco_vida_util: '',
    disco_fecha_revision: ''
  })

  // Estado para libres (telefono)
  const [filas, setFilas] = useState<FilaComponente[]>([])

  const esEstructurado = tipo === 'notebook' || tipo === 'escritorio'

  useEffect(() => {
    if (inicializado) return
    
    try {
      if (!value || value === '{}') {
        setFilas([])
      } else {
        const parsed = JSON.parse(value)
        if (esEstructurado) {
          setEstructurado({
            marca: parsed.marca || '',
            modelo: parsed.modelo || '',
            cpu: parsed.cpu || '',
            ram_gb: parsed.ram_gb || '',
            ram_tipo: parsed.ram_tipo || '',
            disco_gb: parsed.disco_gb || '',
            disco_tipo: parsed.disco_tipo || '',
            disco_vida_util: parsed.disco_vida_util || '',
            disco_fecha_revision: parsed.disco_fecha_revision || ''
          })
        } else {
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
      }
    } catch {
      setFilas([])
    } finally {
      setInicializado(true)
    }
  }, [value, inicializado, esEstructurado])

  const manejarCambioEstructurado = (campo: string, nuevoValor: string) => {
    const nuevoObj = { ...estructurado, [campo]: nuevoValor }
    setEstructurado(nuevoObj)
    onChange(JSON.stringify(nuevoObj, null, 2))
  }

  const manejarCambioFilas = (nuevasFilas: FilaComponente[]) => {
    setFilas(nuevasFilas)
    
    const obj: Record<string, string> = {}
    nuevasFilas.forEach(fila => {
      const claveFinal = fila.clave === 'otros' ? fila.clavePersonalizada.trim() : fila.clave
      if (claveFinal && fila.valor.trim() !== '') {
        obj[claveFinal] = fila.valor.trim()
      }
    })
    
    onChange(JSON.stringify(obj, null, 2))
  }

  const agregarFila = () => {
    manejarCambioFilas([
      ...filas, 
      { id: Math.random().toString(36).substring(7), clave: 'pantalla', clavePersonalizada: '', valor: '' }
    ])
  }

  const eliminarFila = (id: string) => {
    manejarCambioFilas(filas.filter(f => f.id !== id))
  }

  const actualizarFila = (id: string, campo: keyof FilaComponente, nuevoValor: string) => {
    manejarCambioFilas(filas.map(f => f.id === id ? { ...f, [campo]: nuevoValor } : f))
  }

  if (esEstructurado) {
    return (
      <div className="space-y-4 border p-4 rounded-md bg-muted/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Marca {tipo === 'notebook' && '*'}</Label>
            <Input 
              value={estructurado.marca} 
              onChange={e => manejarCambioEstructurado('marca', e.target.value)}
              disabled={disabled}
              placeholder="Ej. Dell, HP, Lenovo"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Modelo {tipo === 'notebook' && '*'}</Label>
            <Input 
              value={estructurado.modelo} 
              onChange={e => manejarCambioEstructurado('modelo', e.target.value)}
              disabled={disabled}
              placeholder="Ej. Latitude 5420"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label className="text-xs">Procesador (CPU)</Label>
            <Input 
              value={estructurado.cpu} 
              onChange={e => manejarCambioEstructurado('cpu', e.target.value)}
              disabled={disabled}
              placeholder="Ej. i7-1165G7"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <Label className="text-xs">RAM (GB)</Label>
            <Input 
              type="number"
              value={estructurado.ram_gb} 
              onChange={e => manejarCambioEstructurado('ram_gb', e.target.value)}
              disabled={disabled}
              placeholder="16"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tipo RAM</Label>
            <Select 
              value={estructurado.ram_tipo} 
              onValueChange={val => manejarCambioEstructurado('ram_tipo', val)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DDR2">DDR2</SelectItem>
                <SelectItem value="DDR3">DDR3</SelectItem>
                <SelectItem value="DDR4">DDR4</SelectItem>
                <SelectItem value="DDR5">DDR5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t pt-4">
          <div className="space-y-2">
            <Label className="text-xs">Disco (GB)</Label>
            <Input 
              type="number"
              value={estructurado.disco_gb} 
              onChange={e => manejarCambioEstructurado('disco_gb', e.target.value)}
              disabled={disabled}
              placeholder="512"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tipo Disco</Label>
            <Select 
              value={estructurado.disco_tipo} 
              onValueChange={val => manejarCambioEstructurado('disco_tipo', val)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HDD">HDD</SelectItem>
                <SelectItem value="SSD">SSD</SelectItem>
                <SelectItem value="NVMe">NVMe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Vida Útil (%)</Label>
            <Input 
              type="number"
              min="0" max="100"
              value={estructurado.disco_vida_util} 
              onChange={e => manejarCambioEstructurado('disco_vida_util', e.target.value)}
              disabled={disabled}
              placeholder="87"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Revisión Disco</Label>
            <Input 
              type="date"
              value={estructurado.disco_fecha_revision} 
              onChange={e => manejarCambioEstructurado('disco_fecha_revision', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    )
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
