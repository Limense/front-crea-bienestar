import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function actualizarSesion(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evita escribir lógica entre createServerClient y supabase.auth.getUser()
  // Un simple error podría hacer que tu usuario no esté autenticado aleatoriamente.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rutas de dashboard
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/registro') &&
    !request.nextUrl.pathname.startsWith('/recuperar-password') &&
    !request.nextUrl.pathname.startsWith('/actualizar-password') &&
    !request.nextUrl.pathname.startsWith('/auth/') &&
    request.nextUrl.pathname !== '/'
  ) {
    // No hay usuario, redirigir a login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si el usuario está autenticado y trata de acceder a login/registro, redirigir a dashboard
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/registro'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: debes retornar la respuesta de supabaseResponse object como lo obtienes de arriba.
  return supabaseResponse
}
