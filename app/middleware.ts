// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROUTE_HASH = process.env.NEXT_PUBLIC_ROUTE_HASH || 'dev';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use the default export for NextAuth middleware
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    
    // === Handle obscured routes ===
    const dMatch = pathname.match(/^\/d-([^/]+)\/(.+)$/);
    const aMatch = pathname.match(/^\/a-([^/]+)\/(.+)$/);
    
    if (dMatch) {
      const [hash, page] = dMatch.slice(1);
      if (hash === ROUTE_HASH) {
        // Check if user is authorized for dealer routes
        if (token?.role === 'DEALER') {
          // Rewrite to /dealers/[page]
          return NextResponse.rewrite(new URL(`/dealers/${page}`, req.url));
        } else {
          // Redirect to dealer login if not authenticated or not a dealer
          return NextResponse.redirect(new URL(`/d-${ROUTE_HASH}/login`, req.url));
        }
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    if (aMatch) {
      const [hash, page] = aMatch.slice(1);
      if (hash === ROUTE_HASH) {
        // Check if user is authorized for admin routes
        if (token?.role === 'ADMIN') {
          // Rewrite to /admin/[page]
          return NextResponse.rewrite(new URL(`/admin/${page}`, req.url));
        } else {
          // Redirect to admin login if not authenticated or not an admin
          return NextResponse.redirect(new URL(`/a-${ROUTE_HASH}/login`, req.url));
        }
      } else {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // === Block direct access in production ===
    if (IS_PRODUCTION && (pathname.startsWith('/dealers/') || pathname.startsWith('/admin/'))) {
      console.warn(`🚫 Blocked direct access to original route: ${pathname}`);
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // === Role-based access control for original routes (dev only) ===
    if (!IS_PRODUCTION) {
      if (pathname.startsWith('/dealers/')) {
        if (token?.role === 'DEALER') {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(new URL('/dealers/login', req.url));
        }
      }
      
      if (pathname.startsWith('/admin/')) {
        if (token?.role === 'ADMIN') {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(new URL('/admin/login', req.url));
        }
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to login pages
        if (pathname === '/admin/login' || pathname === '/dealers/login' || 
            pathname === `/d-${ROUTE_HASH}/login` || pathname === `/a-${ROUTE_HASH}/login`) {
          return true;
        }
        
        // Check role-based access for protected routes
        if (pathname.startsWith('/admin') || pathname.startsWith(`/a-${ROUTE_HASH}`)) {
          return token?.role === 'ADMIN';
        }
        
        if (pathname.startsWith('/dealers') || pathname.startsWith(`/d-${ROUTE_HASH}`)) {
          return token?.role === 'DEALER';
        }
        
        return !!token; // Require auth for other protected routes
      },
    },
    pages: {
      signIn: '/', // Redirect to home if unauthorized
      error: '/',
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