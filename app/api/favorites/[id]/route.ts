import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE: Remove a car from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    // Get session ID from query params
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Delete the favorite
    await prisma.favorite.delete({
      where: {
        sessionId_listingId: {
          sessionId,
          listingId
        }
      }
    });

    // Decrement likeCount on listing
    await prisma.listing.update({
      where: { id: listingId },
      data: { likeCount: { decrement: 1 } }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Removed from favorites'
    });
    
  } catch (error: any) {
    // If not found, still return success (idempotent)
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        success: true,
        message: 'Already removed'
      });
    }
    
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}