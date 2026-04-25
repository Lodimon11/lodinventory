// actions/activos.ts
'use server'

import { crearClienteAdmin } from '@/lib/supabase/admin'
import { Activo, AsignacionConUsuario, AsignacionCompleta, MetricasDashboard, EstadoActivo } from '@/types'
import { revalidatePath } from 'next/cache'

export async function obtenerActivos(): Promise<{ activos: Activo[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error) throw error
    return { activos: data as Activo[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { activos: [], error: mensaje }
  }
}

export async function obtenerActivoPorId(id: string): Promise<{ activo: Activo | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { activo: data as Activo, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { activo: null, error: mensaje }
  }
}

export async function obtenerAsignacionVigente(activoId: string): Promise<{ asignacion: AsignacionConUsuario | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*, usuario:usuarios_sistema(*)')
      .eq('activo_id', activoId)
      .is('desasignado_en', null)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 es "no rows returned"
    return { asignacion: data as AsignacionConUsuario, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { asignacion: null, error: mensaje }
  }
}

export async function obtenerHistorialAsignaciones(activoId: string): Promise<{ historial: AsignacionConUsuario[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*, usuario:usuarios_sistema(nombre_completo, email)')
      .eq('activo_id', activoId)
      .order('asignado_en', { ascending: false })

    if (error) throw error
    return { historial: data as AsignacionConUsuario[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { historial: [], error: mensaje }
  }
}

export async function obtenerMantenimientos(activoId: string) {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('mantenimiento')
      .select('*')
      .eq('activo_id', activoId)
      .order('fecha', { ascending: false })

    if (error) throw error
    return { mantenimientos: data, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { mantenimientos: [], error: mensaje }
  }
}

export async function obtenerMetricas(): Promise<{ metricas: MetricasDashboard; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    
    const { data, error } = await supabase
      .from('activos')
      .select('estado')

    if (error) throw error

    const conteo = (data || []).reduce((acc: Record<string, number>, curr) => {
      acc[curr.estado] = (acc[curr.estado] || 0) + 1
      return acc
    }, {})

    const metricas = {
      total: data?.length || 0,
      asignados: conteo['activo'] || 0,
      enReparacion: conteo['en_reparacion'] || 0,
      disponibles: (conteo['desasignado'] || 0) + (conteo['listo_para_entregar'] || 0)
    }

    return { metricas, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { 
      metricas: { total: 0, asignados: 0, enReparacion: 0, disponibles: 0 }, 
      error: mensaje 
    }
  }
}

export async function obtenerUltimasAsignaciones(limite: number = 5): Promise<{ asignaciones: AsignacionCompleta[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*, usuario:usuarios_sistema(*), activo:activos(*)')
      .order('asignado_en', { ascending: false })
      .limit(limite)

    if (error) throw error
    return { asignaciones: data as AsignacionCompleta[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { asignaciones: [], error: mensaje }
  }
}

export async function obtenerActivosEnReparacion(): Promise<{ activos: Activo[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .select('*')
      .eq('estado', 'en_reparacion')
      .order('etiqueta', { ascending: true })

    if (error) throw error
    return { activos: data as Activo[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { activos: [], error: mensaje }
  }
}

export async function obtenerActivosPool(): Promise<{ activos: Activo[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .select('*')
      .neq('estado', 'activo')
      .order('actualizado_en', { ascending: false })

    if (error) throw error
    return { activos: data as Activo[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { activos: [], error: mensaje }
  }
}

export async function cambiarEstadoActivo(activoId: string, nuevoEstado: EstadoActivo): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase
      .from('activos')
      .update({ estado: nuevoEstado, actualizado_en: new Date().toISOString() })
      .eq('id', activoId)

    if (error) throw error
    
    revalidatePath('/pool')
    revalidatePath(`/activos/${activoId}`)
    revalidatePath('/')
    
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cambiar estado'
    return { exito: false, error: mensaje }
  }
}

export async function crearActivo(datos: Partial<Activo>): Promise<{ activo: Activo | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .insert(datos)
      .select()
      .single()

    if (error) throw error
    
    revalidatePath('/activos')
    revalidatePath('/pool')
    revalidatePath('/')
    
    return { activo: data as Activo, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear el activo'
    return { activo: null, error: mensaje }
  }
}

export async function actualizarActivo(id: string, datos: Partial<Activo>): Promise<{ activo: Activo | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .update({ ...datos, actualizado_en: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    revalidatePath('/activos')
    revalidatePath(`/activos/${id}`)
    revalidatePath('/pool')
    revalidatePath('/')
    
    return { activo: data as Activo, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar el activo'
    return { activo: null, error: mensaje }
  }
}

export async function crearMantenimiento(activoId: string, datos: { descripcion: string; fecha: string; costo: number | null }): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase
      .from('mantenimiento')
      .insert({
        activo_id: activoId,
        ...datos
      })

    if (error) throw error
    
    revalidatePath(`/activos/${activoId}`)
    
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar el mantenimiento'
    return { exito: false, error: mensaje }
  }
}

export async function eliminarActivo(id: string): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase
      .from('activos')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    revalidatePath('/activos')
    revalidatePath('/pool')
    revalidatePath('/')
    
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar el activo'
    return { exito: false, error: mensaje }
  }
}

