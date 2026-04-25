import { Package } from 'lucide-react'
import { NavSidebar } from '@/components/layout/NavSidebar'
import { BarraSuperior } from '@/components/layout/BarraSuperior'

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Se aplica solo al grupo (dashboard) */}
      <aside className="w-64 shrink-0 flex flex-col bg-[linear-gradient(180deg,#191E29,#141920)] border-r-[0.5px] border-r-[rgba(255,255,255,0.06)]">
        <div className="p-6 border-b border-border/30">
          <h1 className="text-xl font-bold flex items-center gap-2 text-sidebar-foreground">
            <span className="w-2.5 h-2.5 bg-[#01C38D] rounded-full inline-block"></span>
            lodinventory
          </h1>
        </div>
        <NavSidebar />
      </aside>

      {/* Contenedor principal con barra superior */}
      <div className="flex flex-col flex-1 overflow-hidden bg-muted/20">
        <BarraSuperior />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
