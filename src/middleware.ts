import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Edge-level auth check for /admin and /dashboard, on top of the
// server-side checks already in those pages (defense in depth — this
// catches unauthenticated access before the page even starts rendering).
//
// Scoped narrowly via `matcher` below: this must NOT run on every request
// site-wide, since /packages, /destinations, etc. are deliberately cached
// (ISR) — running a Supabase auth check on every hit there would add a
// subrequest to every cached page load and undercut that caching work.
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  })

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin and /dashboard. If there's no user, redirect to /login.
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')

  if (!user && (isAdminPath || isDashboardPath)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Explicitly validate admin role for /admin paths
  if (user && isAdminPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      // If they are logged in but not an admin, redirect them to the dashboard
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
