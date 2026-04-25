import { NavSidebar } from '@/components/layout/NavSidebar'
import { BarraSuperior } from '@/components/layout/BarraSuperior'

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Sidebar - Se aplica solo al grupo (dashboard) */}
      <aside className="w-64 shrink-0 flex flex-col p-4 bg-transparent">
        <div className="flex-1 rounded-2xl bg-card border border-border overflow-hidden shadow-sm flex flex-col relative z-10">
          <div className="p-6 border-b border-border/50">
            <h1 className="text-xl font-bold flex items-center gap-3 text-foreground tracking-tight">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <span className="w-3 h-3 bg-primary rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.5)] inline-block"></span>
              </div>
              lodinventory
            </h1>
          </div>
          <NavSidebar />
        </div>
      </aside>

      {/* Contenedor principal con barra superior */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <BarraSuperior />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
