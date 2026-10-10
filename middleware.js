import { NextResponse } from 'next/server';
import { verifySessionValue } from './src/lib/session-crypto';
import { SESSION_COOKIE } from './src/lib/session-constants';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const isPrivate = pathname.startsWith('/orders') || pathname.startsWith('/checkout');
  const isKitchen = pathname.startsWith('/kitchen');

  if (!isPrivate && !isKitchen) return NextResponse.next();

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionValue(sessionCookie);

  if (!session) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isKitchen && session.role !== 'staff') {
    return NextResponse.redirect(new URL('/orders', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/checkout/:path*', '/kitchen/:path*']
};
