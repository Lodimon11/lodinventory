'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { UsuarioSistema } from '@/types'
import { crearUsuario, actualizarUsuario } from '@/actions/usuarios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const esquemaUsuario = z.object({
  nombre_completo: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Debe ser un correo electrónico válido.' }),
  departamento: z.string().optional().or(z.literal('')),
  cargo: z.string().optional().or(z.literal('')),
})

type ValoresFormulario = z.infer<typeof esquemaUsuario>

interface FormularioUsuarioProps {
  usuario?: UsuarioSistema
}

export function FormularioUsuario({ usuario }: FormularioUsuarioProps) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const esEdicion = !!usuario

  const form = useForm<ValoresFormulario>({
    resolver: zodResolver(esquemaUsuario),
    defaultValues: {
      nombre_completo: usuario?.nombre_completo || '',
      email: usuario?.email || '',
      departamento: usuario?.departamento || '',
      cargo: usuario?.cargo || '',
    },
  })

  async function manejarEnvio(datos: ValoresFormulario) {
    setCargando(true)
    
    const datosParseados = {
      ...datos,
      departamento: datos.departamento === '' ? null : datos.departamento,
      cargo: datos.cargo === '' ? null : datos.cargo,
    }

    let errorRespuesta = null
    let idUsuario = usuario?.id

    if (esEdicion && idUsuario) {
      const { error } = await actualizarUsuario(idUsuario, datosParseados)
      errorRespuesta = error
    } else {
      const { usuario: nuevoUsuario, error } = await crearUsuario(datosParseados)
      errorRespuesta = error
      if (nuevoUsuario) idUsuario = nuevoUsuario.id
    }

    setCargando(false)

    if (errorRespuesta) {
      toast.error(errorRespuesta)
    } else {
      toast.success(esEdicion ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito')
      router.push(`/usuarios/${idUsuario}`)
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombre_completo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Juan Pérez" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="juan.perez@empresa.com" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Ingeniería" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Desarrollador Frontend" {...field} disabled={cargando} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={cargando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={cargando}>
            {cargando && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {esEdicion ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
