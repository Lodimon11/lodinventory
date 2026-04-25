'use client'
// =============================================================================
// src/components/layout/BarraLateral.tsx
// Sidebar de navegación principal
// =============================================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Monitor,
  Users,
  GitBranch,
  Wrench,
  BarChart2,
  Package,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RUTAS } from '@/constantes'
import { crearClienteNavegador } from '@/lib/supabase/cliente'
import { useRouter } from 'next/navigation'

const elementosNav = [
  { href: RUTAS.inicio,       etiqueta: 'Dashboard',      icono: BarChart2   },
  { href: RUTAS.activos,      etiqueta: 'Activos',         icono: Monitor     },
  { href: RUTAS.usuarios,     etiqueta: 'Usuarios',        icono: Users       },
  { href: RUTAS.asignaciones, etiqueta: 'Asignaciones',    icono: GitBranch   },
  { href: RUTAS.mantenimiento,etiqueta: 'Mantenimiento',   icono: Wrench      },
  { href: RUTAS.reportes,     etiqueta: 'Reportes',        icono: BarChart2   },
]

export function BarraLateral() {
  const rutaActual = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    const supabase = crearClienteNavegador()
    await supabase.auth.signOut()
    router.push(RUTAS.login)
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <Package className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">lodinventory</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {elementosNav.map(({ href, etiqueta, icono: Icono }) => {
          const estaActivo =
            href === RUTAS.inicio
              ? rutaActual === href
              : rutaActual.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                estaActivo
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icono className="w-4 h-4 shrink-0" />
              {etiqueta}
            </Link>
          )
        })}
      </nav>

      {/* Cerrar sesión */}
      <div className="px-3 pb-4 border-t border-border pt-4">
        <button
          onClick={cerrarSesion}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
