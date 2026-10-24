import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only protect /admin and subroutes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (sessionCookie) {
      const result = await verifySessionToken(sessionCookie);
      isAuthenticated = result.valid;
    }

    // If on login page and already authenticated, redirect to /admin or requested destination
    if (isLoginPage) {
      if (isAuthenticated) {
        const rawNext = request.nextUrl.searchParams.get('next');
        const safeDestination =
          rawNext && rawNext.startsWith('/admin') && !rawNext.startsWith('//') && !rawNext.includes('\\')
            ? rawNext
            : '/admin';
        return NextResponse.redirect(new URL(safeDestination, request.url));
      }
      return NextResponse.next();
    }

    // For all other /admin routes, require authentication and preserve destination
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      const targetDestination = pathname + search;
      loginUrl.searchParams.set('next', targetDestination);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
