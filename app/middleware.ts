// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROUTE_HASH = process.env.NEXT_PUBLIC_ROUTE_HASH || 'dev';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use the default export for NextAuth middleware
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // === Handle obscured routes ===
    const dMatch = pathname.match(/^\/d-([^/]+)\/(.+)$/);
    const aMatch = pathname.match(/^\/a-([^/]+)\/(.+)$/);
    
    if (dMatch) {
      const [hash, page] = dMatch.slice(1);
      if (hash === ROUTE_HASH) {
        // Rewrite to /dealers/[page]
        return NextResponse.rewrite(new URL(`/dealers/${page}`, req.url));
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    if (aMatch) {
      const [hash, page] = aMatch.slice(1);
      if (hash === ROUTE_HASH) {
        // Rewrite to /admin/[page]
        return NextResponse.rewrite(new URL(`/admin/${page}`, req.url));
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // === Block direct access in production ===
    if (IS_PRODUCTION && (pathname.startsWith('/dealers/') || pathname.startsWith('/admin/'))) {
      console.warn(`🚫 Blocked direct access to original route: ${pathname}`);
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Protect dealer/admin routes
        if (token) {
          return true;
        }
        return false;
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
);

export const config = {
  matcher: [
    "/dealers/:path*",
    "/admin/:path*",
    "/d-:hash/:path*",
    "/a-:hash/:path*",
  ]
};