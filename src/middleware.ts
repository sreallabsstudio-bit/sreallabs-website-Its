import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth'

/**
 * Route guard:
 *  - /admin/**          → requires admin session, except /admin/login
 *  - /api/admin/**      → requires admin session, except /api/admin/login + /api/admin/logout
 * Unauthenticated /admin pages redirect to /admin/login?next=<path>.
 * Unauthenticated /api/admin calls get 401 JSON.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApi = pathname.startsWith('/api/admin/')
  if (!isAdminPage && !isAdminApi) return NextResponse.next()

  const isLoginPage = pathname === '/admin/login'
  const isAuthEndpoint = pathname === '/api/admin/login' || pathname === '/api/admin/logout'

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionToken(token)

  // Logged-in users shouldn't see the login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (isLoginPage || isAuthEndpoint) return NextResponse.next()

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
