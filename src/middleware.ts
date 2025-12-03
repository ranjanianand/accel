import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/migrations',
  '/setup',
  '/settings',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Redirect root to product page
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/product', request.url))
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is auth page (login/signup)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Simple token presence check (detailed verification happens server-side)
  const hasToken = !!token

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !hasToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if accessing auth pages with token
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|product|demo).*)',
  ],
}
