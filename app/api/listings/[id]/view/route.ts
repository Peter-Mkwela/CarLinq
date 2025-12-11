import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    
    // Get session ID from request body
    const body = await request.json();
    const { sessionId } = body;
    
    console.log('👁️ View tracking for listing:', listingId, 'session:', sessionId);
    
    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    // Create a view record
    if (sessionId) {
      await prisma.view.create({
        data: {
          sessionId,
          listingId,
          viewedAt: new Date()
        }
      });
    }
    
    // Increment viewCount on the listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        viewCount: { increment: 1 }
      }
    });
    
    console.log('✅ View count incremented for listing:', listingId, 'new count:', updatedListing.viewCount);
    
    return NextResponse.json({ 
      success: true, 
      viewCount: updatedListing.viewCount,
      message: 'View tracked successfully'
    });
    
  } catch (error) {
    console.error('💥 Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}