import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const listingId = request.nextUrl.searchParams.get('listingId');
    
    if (!sessionId || !listingId) {
      return NextResponse.json(
        { error: 'Session ID and Listing ID required' },
        { status: 400 }
      );
    }
    
    const favorite = await prisma.favorite.findUnique({
      where: {
        sessionId_listingId: {
          sessionId,
          listingId
        }
      }
    });
    
    return NextResponse.json({
      isFavorited: !!favorite
    });
    
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}