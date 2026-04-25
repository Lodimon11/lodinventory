'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DialogConfirmacionProps {
  abierto: boolean
  onCancelar: () => void
  onConfirmar: () => void
  titulo: string
  descripcion: string
  textoCancelar?: string
  textoConfirmar?: string
  variante?: 'default' | 'destructive'
  cargando?: boolean
  children?: React.ReactNode
}

export function DialogConfirmacion({
  abierto,
  onCancelar,
  onConfirmar,
  titulo,
  descripcion,
  textoCancelar = 'Cancelar',
  textoConfirmar = 'Confirmar',
  variante = 'destructive',
  cargando = false,
  children
}: DialogConfirmacionProps) {
  return (
    <Dialog open={abierto} onOpenChange={(val) => !val && !cargando && onCancelar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descripcion}</DialogDescription>
        </DialogHeader>
        
        {children}

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancelar} disabled={cargando}>
            {textoCancelar}
          </Button>
          <Button variant={variante} onClick={onConfirmar} disabled={cargando}>
            {textoConfirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
