import { NextResponse } from 'next/server'
import { crearClienteAdmin } from '@/lib/supabase/admin'

function escaparCSV(valor: unknown): string {
  if (valor === null || valor === undefined) return ''
  const str = String(valor)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

interface ActivoExport {
  etiqueta: string;
  tipo: string;
  estado: string;
  direccion_mac: string | null;
  componentes: Record<string, unknown> | null;
  asignaciones?: Array<{
    asignado_en: string;
    desasignado_en: string | null;
    usuario: {
      nombre_completo: string;
      email: string;
      departamento: string | null;
    } | null;
  }>;
}

export async function GET() {
  try {
    const supabase = crearClienteAdmin()
    
    const { data: activos, error } = await supabase
      .from('activos')
      .select(`
        *,
        asignaciones (
          asignado_en,
          desasignado_en,
          usuario:usuarios_sistema (
            nombre_completo,
            email,
            departamento
          )
        )
      `)

    if (error) throw error

    const lineasCSV = [
      ['Etiqueta', 'Tipo', 'Estado', 'Dirección MAC', 'Usuario Asignado', 'Email Usuario', 'Departamento', 'Asignado Desde', 'Componentes']
    ]

    activos.forEach((activo: ActivoExport) => {
      const asignacionActiva = activo.asignaciones?.find((a) => !a.desasignado_en)
      const usuario = asignacionActiva?.usuario

      lineasCSV.push([
        escaparCSV(activo.etiqueta),
        escaparCSV(activo.tipo),
        escaparCSV(activo.estado),
        escaparCSV(activo.direccion_mac),
        escaparCSV(usuario?.nombre_completo || 'Sin asignar'),
        escaparCSV(usuario?.email || ''),
        escaparCSV(usuario?.departamento || ''),
        escaparCSV(asignacionActiva ? new Date(asignacionActiva.asignado_en).toLocaleDateString('es-AR') : ''),
        escaparCSV(activo.componentes ? JSON.stringify(activo.componentes) : '')
      ])
    })

    const contenidoCSV = lineasCSV.map(fila => fila.join(',')).join('\n')
    const fecha = new Date().toISOString().split('T')[0]

    return new NextResponse(contenidoCSV, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="activos-${fecha}.csv"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al exportar activos' }, { status: 500 })
  }
}
