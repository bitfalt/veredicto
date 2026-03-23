import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname, search } = request.nextUrl;

  if (!sessionCookie && pathname.startsWith('/panel')) {
    const loginUrl = new URL('/inicio-de-sesion', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && pathname === '/inicio-de-sesion') {
    const requestedNext = request.nextUrl.searchParams.get('next');
    const safeNext = requestedNext && requestedNext.startsWith('/') ? requestedNext : '/panel';

    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/inicio-de-sesion'],
};
