'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function FormularioLogin() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.')
      return
    }

    setCargando(true)
    const supabase = crearClienteNavegador()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Credenciales incorrectas o error al iniciar sesión.')
      setCargando(false)
    } else {
      toast.success('Sesión iniciada correctamente.')
      router.push('/')
      router.refresh()
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <form onSubmit={manejarSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cargando}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cargando}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={cargando}>
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
