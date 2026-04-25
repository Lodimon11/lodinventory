'use client'

import { useState } from 'react'
import { iniciarSesion } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Package } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function PaginaLogin() {
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(formData: FormData) {
    setCargando(true)
    setError(null)
    
    const respuesta = await iniciarSesion(formData)
    
    if (respuesta?.error) {
      setError(respuesta.error)
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">lodinventory</CardTitle>
          <CardDescription>Ingresa a tu cuenta para gestionar el inventario IT</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={manejarEnvio} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@empresa.com" 
                required 
                disabled={cargando}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={cargando}
              />
            </div>
            <Button type="submit" className="w-full mt-6" disabled={cargando}>
              {cargando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Ingresar al sistema'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
