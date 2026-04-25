'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { BotonTema } from '@/components/comunes/BotonTema'
import { LogOut, Bell } from 'lucide-react'
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

  const inicial = usuario?.email ? usuario.email.charAt(0).toUpperCase() : 'A'
  const fechaCreacion = usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('es-AR') : '-'
  const ultimoAcceso = usuario?.last_sign_in_at ? new Date(usuario.last_sign_in_at).toLocaleString('es-AR') : '-'

  return (
    <div className="flex flex-col w-full shrink-0">
      <header className="h-[88px] shrink-0 bg-transparent flex items-center justify-between px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {titulo}
        </h2>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <BotonTema />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors w-10 h-10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-background"></span>
            </Button>
          </div>
          
          <div className="h-8 w-[1px] bg-border/50"></div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
              <div className="text-sm text-right hidden sm:flex flex-col">
                <span className="font-semibold text-foreground text-sm">
                  {usuario?.email || 'admin@admin.com'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Administrador IT
                </span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                {inicial}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 neo-card border-none" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{usuario?.email || 'Cargando...'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Administrador IT
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/50" />
              
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
                  <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
                    Administrador IT
                  </Badge>
                </div>
              </div>
              
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={() => cerrarSesion()} className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}
