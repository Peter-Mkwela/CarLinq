// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTE_HASH = process.env.NEXT_PUBLIC_ROUTE_HASH || 'dev';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // === 1. BLOCK original dealer/admin routes in production ===
  if (IS_PRODUCTION && (pathname.startsWith('/dealers/') || pathname.startsWith('/admin/'))) {
    console.warn(`🚫 Blocked direct access to original route: ${pathname}`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // === 2. Handle obscured routes ===
  // Check for /d-[hash]/[page] pattern
  const dMatch = pathname.match(new RegExp(`^/d-([^/]+)/(.+)$`));
  const aMatch = pathname.match(new RegExp(`^/a-([^/]+)/(.+)$`));
  
  if (dMatch) {
    const [hash, page] = dMatch.slice(1);
    
    // Check if hash matches
    if (hash === ROUTE_HASH) {
      // Rewrite to /dealers/[page]
      return NextResponse.rewrite(new URL(`/dealers/${page}`, request.url));
    } else {
      // Invalid hash
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  if (aMatch) {
    const [hash, page] = aMatch.slice(1);
    
    // Check if hash matches
    if (hash === ROUTE_HASH) {
      // Rewrite to /admin/[page]
      return NextResponse.rewrite(new URL(`/admin/${page}`, request.url));
    } else {
      // Invalid hash
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // === 3. Continue with NextAuth protection ===
  return withAuth({
    callbacks: {
      authorized: ({ token }) => {
        // Protect dealer/admin routes
        if (pathname.startsWith('/dealers/') || pathname.startsWith('/admin/')) {
          return !!token;
        }
        return true; // Allow public routes
      },
    },
  })(request);
}

export const config = {
  matcher: [
    "/dealers/:path*",
    "/admin/:path*",
    "/d-:path*",  // Match /d-anything
    "/a-:path*",  // Match /a-anything
  ]
};