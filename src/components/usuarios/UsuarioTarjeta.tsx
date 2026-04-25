import { UsuarioConCantidadActivos } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Briefcase, Mail, Monitor } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export function UsuarioTarjeta({ usuario }: { usuario: UsuarioConCantidadActivos }) {
  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{usuario.nombre_completo}</CardTitle>
          <Badge variant={usuario.cantidad_activos > 0 ? 'default' : 'secondary'} className="flex gap-1 items-center">
            <Monitor className="w-3 h-3" />
            {usuario.cantidad_activos}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">{usuario.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="truncate">{usuario.departamento || 'Sin departamento'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="w-4 h-4 shrink-0" />
          <span className="truncate">{usuario.cargo || 'Sin cargo'}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <Link 
          href={`/usuarios/${usuario.id}`} 
          className={buttonVariants({ variant: 'secondary', className: 'w-full' })}
        >
          Ver ficha
        </Link>
      </CardFooter>
    </Card>
  )
}
