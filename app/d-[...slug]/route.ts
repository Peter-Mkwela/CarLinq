// app/d/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ROUTE_HASH = 'dev'; // For testing

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug;
  
  if (!slug || slug.length < 2) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  const [hash, page] = slug;
  
  if (hash !== ROUTE_HASH) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Map to real pages
  if (page === 'auth') {
    return NextResponse.rewrite(new URL('/dealers/login', request.url));
  }
  
  if (page === 'dashboard') {
    return NextResponse.rewrite(new URL('/dealers/dealer-dashboard', request.url));
  }
  
  if (page === 'join') {
    return NextResponse.rewrite(new URL('/dealers/register', request.url));
  }
  
  return NextResponse.redirect(new URL('/', request.url));
}

export async function POST(request: NextRequest, context: { params: { slug: string[] } }) {
  return GET(request, context);
}