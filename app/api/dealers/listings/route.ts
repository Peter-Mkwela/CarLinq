/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/dealers/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 API Route - Starting dealer listings fetch...');
    
    const session = await getServerSession(authOptions);
    
    console.log('🔐 API Route - Full session:', session);
    console.log('📧 API Route - User email:', session?.user?.email);
    console.log('🆔 API Route - User ID:', session?.user?.id);
    
    // Try both email and ID approaches
    if (!session?.user?.id && !session?.user?.email) {
      console.log('❌ API Route - No session, email, or ID found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let user;
    
    // Try to find user by ID first (more reliable)
    if (session.user.id) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      console.log('👤 API Route - User found by ID:', user?.id);
    }
    
    // If not found by ID, try by email
    if (!user && session.user.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      console.log('👤 API Route - User found by email:', user?.id);
    }

    if (!user) {
      console.log('❌ API Route - User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: any = { dealerId: user.id };
    
    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        dealer: {
          select: {
            name: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    console.log('📊 API Route - Listings found:', listings.length);
    console.log('🚗 API Route - Sample listing:', listings[0]);

    return NextResponse.json({ listings });

  } catch (error) {
    console.error('❌ API Route - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}