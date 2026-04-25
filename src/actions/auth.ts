'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { crearClienteServidor } from '@/lib/supabase/servidor'

export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await crearClienteServidor()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciales inválidas o error de conexión' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
