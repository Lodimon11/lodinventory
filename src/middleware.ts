import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let respuesta = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesParaEstablecer) {
          cookiesParaEstablecer.forEach(({ name, value }) => request.cookies.set(name, value))
          respuesta = NextResponse.next({
            request,
          })
          cookiesParaEstablecer.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const urlActual = request.nextUrl.pathname

  // Si no hay usuario y no está en login, redirigir a login
  if (!user && !urlActual.startsWith('/auth/login')) {
    const urlLogin = request.nextUrl.clone()
    urlLogin.pathname = '/auth/login'
    return NextResponse.redirect(urlLogin)
  }

  // Si hay usuario y está intentando acceder a login, redirigir al dashboard
  if (user && urlActual.startsWith('/auth/login')) {
    const urlDashboard = request.nextUrl.clone()
    urlDashboard.pathname = '/'
    return NextResponse.redirect(urlDashboard)
  }

  return respuesta
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de la solicitud excepto aquellas que comiencen con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imágenes)
     * - favicon.ico (archivo de icono)
     * - imagenes publicas
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
