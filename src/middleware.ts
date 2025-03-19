import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Forum default route handling
  if (path === "/forum" || path === "/forum/") {
    return NextResponse.redirect(new URL("/forum/latest", request.url));
  }

  // Define path categories
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPath = authPaths.includes(path);
  const isRoot = path === "/";

  // Get authentication state
  const isAuthenticated = !!request.cookies.get("user")?.value;

  // Redirect logic
  if (isAuthenticated && isAuthPath) {
    // Authenticated users shouldn't access auth pages
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && !isAuthPath && !isRoot) {
    // Unauthenticated users can only access auth pages
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Default: allow the navigation
  return NextResponse.next();
}

// Match all paths except static files, api routes and static web app health check
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.swa).*)"],
};
