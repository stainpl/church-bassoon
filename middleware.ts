// middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify }               from 'jose'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('CHURCH_TOKEN')?.value
  const { pathname } = req.nextUrl

  // 1) If we’re on a public route, do nothing
  if (
    pathname === '/' ||
    pathname.startsWith('/api/') ||
    pathname === '/admin/login' ||
    pathname === '/member/login' ||
    pathname === '/member/register'
  ) {
    return NextResponse.next()
  }

  // 2) For any other /admin or /member path, require a token
  if (pathname.startsWith('/admin') || pathname.startsWith('/member')) {
    if (!token) {
      // redirect to the appropriate login
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = pathname.startsWith('/admin')
        ? '/admin/login'
        : '/member/login'
      return NextResponse.redirect(loginUrl)
    }

    try {
      // 3) verify the JWT
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )
      return NextResponse.next()
    } catch (err) {
      console.error('JWT verification failed:', err)
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = pathname.startsWith('/admin')
        ? '/admin/login'
        : '/member/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // 4) everything else is public
  return NextResponse.next()
}

export const config = {
  // run on both /admin/* and /member/* (except their login & register pages)
  matcher: [
    '/admin((?!/login$).*)',
    '/member((?!/login$|/register$).*)',
  ],
}