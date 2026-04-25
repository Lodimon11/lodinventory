'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download } from 'lucide-react'

export function BotonExportar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="gold" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      } />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.location.href = '/api/exportar/activos'}>
          Exportar activos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.href = '/api/exportar/asignaciones'}>
          Exportar asignaciones
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
