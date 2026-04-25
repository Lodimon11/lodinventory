// actions/usuarios.ts
'use server'

import { crearClienteAdmin } from '@/lib/supabase/admin'
import { UsuarioSistema, Activo, AsignacionConActivo, UsuarioConCantidadActivos } from '@/types'
import { revalidatePath } from 'next/cache'

export async function obtenerUsuarios(): Promise<{ usuarios: UsuarioSistema[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .order('nombre_completo', { ascending: true })

    if (error) throw error
    return { usuarios: data as UsuarioSistema[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { usuarios: [], error: mensaje }
  }
}

export async function obtenerUsuarioPorId(id: string): Promise<{ usuario: UsuarioSistema | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { usuario: data as UsuarioSistema, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { usuario: null, error: mensaje }
  }
}

export async function obtenerUsuariosConConteo(): Promise<{ usuarios: UsuarioConCantidadActivos[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .order('nombre_completo', { ascending: true })

    if (errorUsuarios) throw errorUsuarios

    const { data: asignaciones, error: errorAsignaciones } = await supabase
      .from('asignaciones')
      .select('usuario_id')
      .is('desasignado_en', null)

    if (errorAsignaciones) throw errorAsignaciones

    const conteo = (asignaciones || []).reduce((acc: Record<string, number>, curr) => {
      acc[curr.usuario_id] = (acc[curr.usuario_id] || 0) + 1
      return acc
    }, {})

    const usuariosConCantidad = (usuarios || []).map(u => ({
      ...u,
      cantidad_activos: conteo[u.id] || 0
    }))

    return { usuarios: usuariosConCantidad, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { usuarios: [], error: mensaje }
  }
}

export async function obtenerActivosDisponibles(): Promise<{ activos: Activo[]; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('activos')
      .select('*')
      .in('estado', ['desasignado', 'listo_para_entregar'])
      .order('etiqueta', { ascending: true })

    if (error) throw error
    return { activos: data as Activo[], error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { activos: [], error: mensaje }
  }
}

export async function obtenerAsignacionesPorUsuario(usuarioId: string): Promise<{ vigentes: AsignacionConActivo[], historial: AsignacionConActivo[], error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*, activo:activos(*)')
      .eq('usuario_id', usuarioId)
      .order('asignado_en', { ascending: false })

    if (error) throw error

    const asignaciones = data as AsignacionConActivo[]
    const vigentes = asignaciones.filter(a => a.desasignado_en === null)
    const historial = asignaciones.filter(a => a.desasignado_en !== null)

    return { vigentes, historial, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    return { vigentes: [], historial: [], error: mensaje }
  }
}

export async function ejecutarAsignacion(activoId: string, usuarioId: string, notas: string | null): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase.rpc('asignar_activo', {
      p_activo_id: activoId,
      p_usuario_id: usuarioId,
      p_notas: notas
    })

    if (error) throw error
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al asignar'
    return { exito: false, error: mensaje }
  }
}

export async function ejecutarDesasignacion(asignacionId: string, notas: string | null): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase.rpc('desasignar_activo', {
      p_asignacion_id: asignacionId,
      p_notas: notas
    })

    if (error) throw error
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al desasignar'
    return { exito: false, error: mensaje }
  }
}

export async function crearUsuario(datos: Partial<UsuarioSistema>): Promise<{ usuario: UsuarioSistema | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .insert(datos)
      .select()
      .single()

    if (error) throw error
    
    revalidatePath('/usuarios')
    
    return { usuario: data as UsuarioSistema, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear el usuario'
    return { usuario: null, error: mensaje }
  }
}

export async function actualizarUsuario(id: string, datos: Partial<UsuarioSistema>): Promise<{ usuario: UsuarioSistema | null; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .update(datos)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    
    revalidatePath('/usuarios')
    revalidatePath(`/usuarios/${id}`)
    
    return { usuario: data as UsuarioSistema, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar el usuario'
    return { usuario: null, error: mensaje }
  }
}

export async function eliminarUsuario(id: string): Promise<{ exito: boolean; error: string | null }> {
  try {
    const supabase = crearClienteAdmin()
    const { error } = await supabase
      .from('usuarios_sistema')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    revalidatePath('/usuarios')
    
    return { exito: true, error: null }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar el usuario'
    return { exito: false, error: mensaje }
  }
}

