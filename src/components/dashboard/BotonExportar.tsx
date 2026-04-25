'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download } from 'lucide-react'

export function BotonExportar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" className="neo-input bg-transparent hover:bg-white/5 text-primary border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-primary/50 gap-2 h-11 px-6 rounded-xl transition-all duration-300">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      } />
      <DropdownMenuContent align="end" className="neo-card border-none bg-[#121620]/95 backdrop-blur-xl p-2 min-w-[200px]">
        <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer rounded-lg transition-colors" onClick={() => window.location.href = '/api/exportar/activos'}>
          Exportar activos
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer rounded-lg transition-colors" onClick={() => window.location.href = '/api/exportar/asignaciones'}>
          Exportar asignaciones
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
