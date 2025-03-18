import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register' || path === '/forgot-password';
  
  // Get token from cookies
  const token = request.cookies.get('user')?.value || '';
  
  // Redirect logic
  console.log('path', path);
    console.log('isPublicPath', isPublicPath);
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (!isPublicPath && !token && path !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Match all paths except static files and api routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};