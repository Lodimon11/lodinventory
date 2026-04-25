import { NextResponse } from 'next/server'
import { crearClienteAdmin } from '@/lib/supabase/admin'

function escaparCSV(valor: any): string {
  if (valor === null || valor === undefined) return ''
  const str = String(valor)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  try {
    const supabase = crearClienteAdmin()
    
    const { data: asignaciones, error } = await supabase
      .from('asignaciones')
      .select(`
        *,
        activo:activos (
          etiqueta,
          tipo
        ),
        usuario:usuarios_sistema (
          nombre_completo,
          email,
          departamento
        )
      `)
      .order('asignado_en', { ascending: false })

    if (error) throw error

    const lineasCSV = [
      ['Equipo', 'Tipo', 'Usuario', 'Email', 'Departamento', 'Asignado En', 'Desasignado En', 'Notas']
    ]

    asignaciones.forEach((asig: any) => {
      lineasCSV.push([
        escaparCSV(asig.activo?.etiqueta),
        escaparCSV(asig.activo?.tipo),
        escaparCSV(asig.usuario?.nombre_completo),
        escaparCSV(asig.usuario?.email),
        escaparCSV(asig.usuario?.departamento),
        escaparCSV(new Date(asig.asignado_en).toLocaleDateString('es-AR')),
        escaparCSV(asig.desasignado_en ? new Date(asig.desasignado_en).toLocaleDateString('es-AR') : 'Vigente'),
        escaparCSV(asig.notas || '')
      ])
    })

    const contenidoCSV = lineasCSV.map(fila => fila.join(',')).join('\n')
    const fecha = new Date().toISOString().split('T')[0]

    return new NextResponse(contenidoCSV, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="asignaciones-${fecha}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al exportar asignaciones' }, { status: 500 })
  }
}
