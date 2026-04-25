'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { PlusCircle, Loader2 } from 'lucide-react'
import { crearMantenimiento } from '@/actions/activos'

const esquemaMantenimiento = z.object({
  descripcion: z.string().min(3, { message: 'La descripción debe tener al menos 3 caracteres.' }),
  fecha: z.string().min(1, { message: 'La fecha es requerida.' }),
  costo: z.string().optional().or(z.literal('')),
})

type ValoresFormulario = z.infer<typeof esquemaMantenimiento>

interface FormularioMantenimientoProps {
  activoId: string
  textoBoton?: string
  classNameBoton?: string
}

export function FormularioMantenimiento({ activoId, textoBoton = 'Registrar mantenimiento', classNameBoton }: FormularioMantenimientoProps) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)

  const hoy = new Date().toISOString().split('T')[0]

  const form = useForm<ValoresFormulario>({
    resolver: zodResolver(esquemaMantenimiento),
    defaultValues: {
      descripcion: '',
      fecha: hoy,
      costo: '',
    },
  })

  async function manejarEnvio(datos: ValoresFormulario) {
    setCargando(true)
    
    const costoFinal = datos.costo === '' || datos.costo === undefined ? null : Number(datos.costo)

    const { error } = await crearMantenimiento(activoId, {
      descripcion: datos.descripcion,
      fecha: datos.fecha,
      costo: costoFinal
    })

    setCargando(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Mantenimiento registrado con éxito')
      setAbierto(false)
      form.reset()
      router.refresh()
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger render={
        <Button size="sm" variant="secondary" className={`gap-2 ${classNameBoton || ''}`}>
          <PlusCircle className="w-4 h-4" />
          {textoBoton}
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Mantenimiento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-4">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del trabajo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej. Cambio de disco y limpieza interna..." {...field} disabled={cargando} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={cargando} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo ($) (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} value={field.value ?? ''} disabled={cargando} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAbierto(false)} disabled={cargando}>
                Cancelar
              </Button>
              <Button type="submit" disabled={cargando}>
                {cargando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
