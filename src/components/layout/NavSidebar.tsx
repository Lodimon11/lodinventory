'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Monitor, Users, Package, Grid, LogOut } from 'lucide-react'
import { cerrarSesion } from '@/actions/auth'

const ENLACES_NAVEGACION = [
  { ruta: '/', etiqueta: 'Dashboard', icono: Grid },
  { ruta: '/activos', etiqueta: 'Activos', icono: Monitor },
  { ruta: '/usuarios', etiqueta: 'Usuarios', icono: Users },
  { ruta: '/pool', etiqueta: 'Pool de equipos', icono: Package },
]

export function NavSidebar() {
  const rutaActual = usePathname()

  return (
    <nav className="flex flex-col h-full bg-transparent py-4 flex-1 px-3">
      <div className="flex-1 space-y-1.5 mt-2 overflow-y-auto">
        {ENLACES_NAVEGACION.map((enlace) => {
          const Icono = enlace.icono
          const esActivo = rutaActual === enlace.ruta

          return (
            <Link
              key={enlace.ruta}
              href={enlace.ruta}
              className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-300 ${
                esActivo
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground font-medium border border-transparent'
              }`}
            >
              {esActivo && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}
              <div className={`p-1.5 rounded-lg transition-colors duration-300 ${esActivo ? 'bg-primary/20 text-primary' : 'group-hover:text-foreground'}`}>
                <Icono className="w-4 h-4" />
              </div>
              {enlace.etiqueta}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <button
          onClick={() => cerrarSesion()}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 border border-transparent"
        >
          <div className="p-1.5 rounded-lg transition-colors group-hover:bg-destructive/20">
            <LogOut className="w-4 h-4 shrink-0" />
          </div>
          Cerrar sesión
        </button>
        <div className="flex items-center gap-3 px-3 mt-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-foreground">
            N
          </div>
          <span className="text-xs text-muted-foreground/60">v1.0</span>
          <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full inline-block shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
        </div>
      </div>
    </nav>
  )
}
