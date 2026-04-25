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
    <nav className="flex flex-col h-full p-4">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {ENLACES_NAVEGACION.map((enlace) => {
          const Icono = enlace.icono
          const esActivo = rutaActual === enlace.ruta

          return (
            <Link
              key={enlace.ruta}
              href={enlace.ruta}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all border border-transparent ${
                esActivo
                  ? 'bg-[#01C38D18] text-[#01C38D] font-semibold border-[#01C38D40]'
                  : 'text-sidebar-foreground hover:bg-[#01C38D18] hover:text-[#01C38D] font-medium'
              }`}
            >
              <Icono className="w-4 h-4" />
              {enlace.etiqueta}
            </Link>
          )
        })}
      </div>

      <div className="pt-4 mt-auto border-t border-border">
        <button
          onClick={() => cerrarSesion()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
