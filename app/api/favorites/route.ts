/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Get all favorite cars for current session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { sessionId },
      include: {
        listing: true
      }
    });

    return NextResponse.json(favorites);
    
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST: Add a car to favorites
// DELETE: Remove a car from favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, listingId, action } = body;

    console.log('📝 Favorite API called:', { sessionId, listingId, action });

    if (!sessionId || !listingId) {
      return NextResponse.json(
        { error: 'Session ID and Listing ID are required' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      // Handle removal
      try {
        await prisma.favorite.delete({
          where: {
            sessionId_listingId: {
              sessionId,
              listingId
            }
          }
        });

        // Decrement likeCount
        await prisma.listing.update({
          where: { id: listingId },
          data: { likeCount: { decrement: 1 } }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Removed from favorites' 
        });
      } catch (error: any) {
        if (error.code === 'P2025') {
          return NextResponse.json({ 
            success: true, 
            message: 'Already removed' 
          });
        }
        throw error;
      }
    } else {
      // Handle addition (default)
      try {
        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
          where: {
            sessionId_listingId: {
              sessionId,
              listingId
            }
          }
        });

        if (existing) {
          return NextResponse.json({ 
            success: true, 
            message: 'Already in favorites' 
          });
        }

        // Create new favorite
        const favorite = await prisma.favorite.create({
          data: {
            sessionId,
            listingId
          }
        });

        // Increment likeCount
        await prisma.listing.update({
          where: { id: listingId },
          data: { likeCount: { increment: 1 } }
        });

        return NextResponse.json({ 
          success: true, 
          favorite,
          message: 'Added to favorites' 
        }, { status: 201 });
      } catch (error: any) {
        if (error.code === 'P2002') {
          // Already exists
          return NextResponse.json({ 
            success: true, 
            message: 'Already in favorites' 
          });
        }
        throw error;
      }
    }
    
  } catch (error) {
    console.error('💥 Error in favorites API:', error);
    return NextResponse.json(
      { error: 'Failed to process favorite' },
      { status: 500 }
    );
  }
}