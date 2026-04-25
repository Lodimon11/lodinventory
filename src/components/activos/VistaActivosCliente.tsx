'use client'

import { useState } from 'react'
import { Activo } from '@/types'
import { ActivoTarjeta } from '@/components/activos/ActivoTarjeta'
import { FiltrosActivos } from '@/components/activos/FiltrosActivos'

export function VistaActivosCliente({ activosIniciales }: { activosIniciales: Activo[] }) {
  const [activosFiltrados, setActivosFiltrados] = useState<Activo[]>(activosIniciales)

  return (
    <>
      <FiltrosActivos activos={activosIniciales} onChange={setActivosFiltrados} />
      
      {activosFiltrados.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
          No se encontraron activos con los filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activosFiltrados.map((activo) => (
            <ActivoTarjeta key={activo.id} activo={activo} />
          ))}
        </div>
      )}
    </>
  )
}
