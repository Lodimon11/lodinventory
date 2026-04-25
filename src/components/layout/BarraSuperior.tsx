'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { BotonTema } from '@/components/comunes/BotonTema'
import { LogOut } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { cerrarSesion } from '@/actions/auth'

const RUTAS: Record<string, string> = {
  '/': 'Dashboard',
  '/activos': 'Activos',
  '/usuarios': 'Usuarios',
  '/pool': 'Pool de equipos',
}

export function BarraSuperior() {
  const rutaActual = usePathname()
  const [usuario, setUsuario] = useState<User | null>(null)

  const titulo = RUTAS[rutaActual] || 'lodinventory'

  useEffect(() => {
    const cargarUsuario = async () => {
      const supabase = crearClienteNavegador()
      const { data: { user } } = await supabase.auth.getUser()
      setUsuario(user)
    }
    cargarUsuario()
  }, [])

  const inicial = usuario?.email ? usuario.email.charAt(0).toUpperCase() : 'U'
  const fechaCreacion = usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('es-AR') : '-'
  const ultimoAcceso = usuario?.last_sign_in_at ? new Date(usuario.last_sign_in_at).toLocaleString('es-AR') : '-'

  return (
    <div className="flex flex-col w-full shrink-0">
      <header className="h-16 shrink-0 bg-card flex items-center justify-between px-6">
        <h2 className="heading-lg font-semibold text-foreground">
          {titulo}
        </h2>

        <div className="flex items-center gap-3">
          <BotonTema />
          <div className="text-sm text-right hidden sm:block">
            <p className="font-medium leading-none text-foreground">
              {usuario?.email || 'Cargando...'}
            </p>
            <p className="body-text text-muted-foreground mt-1">
              Administrador IT
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors border border-border" />}>
              {inicial}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{usuario?.email || 'Cargando...'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Administrador IT
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              <div className="px-2 py-2 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">Información de cuenta</p>
                <div className="flex justify-between">
                  <span>Creada:</span>
                  <span className="text-foreground">{fechaCreacion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Último acceso:</span>
                  <span className="text-foreground text-xs my-auto">{ultimoAcceso}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span>Permisos:</span>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900/50">
                    Administrador IT
                  </Badge>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => cerrarSesion()} className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="h-[1px] w-full bg-gradient-to-r from-primary to-transparent opacity-80" />
    </div>
  )
}
