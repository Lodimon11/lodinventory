'use client'

import { useState } from 'react'
import { UsuarioConCantidadActivos } from '@/types'
import { UsuarioTarjeta } from '@/components/usuarios/UsuarioTarjeta'
import { FiltrosUsuarios } from '@/components/usuarios/FiltrosUsuarios'

export function VistaUsuariosCliente({ usuariosIniciales }: { usuariosIniciales: UsuarioConCantidadActivos[] }) {
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioConCantidadActivos[]>(usuariosIniciales)

  return (
    <>
      <FiltrosUsuarios usuarios={usuariosIniciales} onChange={setUsuariosFiltrados} />
      
      {usuariosFiltrados.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          No se encontraron usuarios con los filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {usuariosFiltrados.map((usuario) => (
            <UsuarioTarjeta key={usuario.id} usuario={usuario} />
          ))}
        </div>
      )}
    </>
  )
}
