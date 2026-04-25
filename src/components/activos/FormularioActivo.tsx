'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Activo } from '@/types'
import { crearActivo, actualizarActivo } from '@/actions/activos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { EditorComponentes } from '@/components/activos/EditorComponentes'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const esquemaActivo = z.object({
  etiqueta: z.string().min(2, { message: 'La etiqueta debe tener al menos 2 caracteres.' }),
  tipo: z.enum(['notebook', 'escritorio', 'telefono']),
  direccion_mac: z.string().optional().or(z.literal('')),
  estado: z.enum(['activo', 'desasignado', 'listo_para_entregar', 'en_reparacion', 'retirado']),
  componentes: z.string().refine((val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, { message: 'Debe ser un JSON válido' }),
})

type ValoresFormulario = z.infer<typeof esquemaActivo>

interface FormularioActivoProps {
  activo?: Activo
}

export function FormularioActivo({ activo }: FormularioActivoProps) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const esEdicion = !!activo

  const form = useForm<ValoresFormulario>({
    resolver: zodResolver(esquemaActivo),
    defaultValues: {
      etiqueta: activo?.etiqueta || '',
      tipo: activo?.tipo || 'notebook',
      direccion_mac: activo?.direccion_mac || '',
      estado: activo?.estado || 'listo_para_entregar',
      componentes: activo?.componentes ? JSON.stringify(activo.componentes, null, 2) : '{}',
    },
  })

  async function manejarEnvio(datos: ValoresFormulario) {
    setCargando(true)
    
    // Parsear el JSON de los componentes antes de enviar
    const datosParseados = {
      ...datos,
      componentes: JSON.parse(datos.componentes),
      direccion_mac: datos.direccion_mac === '' ? null : datos.direccion_mac
    }

    let errorRespuesta = null
    let idActivo = activo?.id

    if (esEdicion && idActivo) {
      const { error } = await actualizarActivo(idActivo, datosParseados)
      errorRespuesta = error
    } else {
      const { activo: nuevoActivo, error } = await crearActivo(datosParseados)
      errorRespuesta = error
      if (nuevoActivo) idActivo = nuevoActivo.id
    }

    setCargando(false)

    if (errorRespuesta) {
      toast.error(errorRespuesta)
    } else {
      toast.success(esEdicion ? 'Activo actualizado con éxito' : 'Activo creado con éxito')
      router.push(`/activos/${idActivo}`)
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="etiqueta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etiqueta / Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. LPT-001" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direccion_mac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección MAC (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="00:1A:2B:3C:4D:5E" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de equipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={cargando}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="notebook">Notebook</SelectItem>
                    <SelectItem value="escritorio">Escritorio</SelectItem>
                    <SelectItem value="telefono">Teléfono</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado inicial</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={cargando || (esEdicion && activo?.estado === 'activo')}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="activo" disabled>Asignado (Automático)</SelectItem>
                    <SelectItem value="desasignado">Desasignado</SelectItem>
                    <SelectItem value="listo_para_entregar">Listo para entregar</SelectItem>
                    <SelectItem value="en_reparacion">En reparación</SelectItem>
                    <SelectItem value="retirado">Retirado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="componentes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Componentes y especificaciones</FormLabel>
              <FormControl>
                <EditorComponentes 
                  value={field.value} 
                  onChange={field.onChange} 
                  disabled={cargando} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={cargando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={cargando}>
            {cargando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {esEdicion ? 'Guardar cambios' : 'Crear activo'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
