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
    
    console.log('📞 Inquiry tracking for listing:', listingId, 'session:', sessionId);
    
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
    
    // Increment inquiryCount on the listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        inquiryCount: { increment: 1 }
      }
    });
    
    console.log('✅ Inquiry count incremented for listing:', listingId, 'new count:', updatedListing.inquiryCount);
    
    return NextResponse.json({ 
      success: true, 
      inquiryCount: updatedListing.inquiryCount,
      message: 'Inquiry tracked successfully'
    });
    
  } catch (error) {
    console.error('💥 Error tracking inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to track inquiry' },
      { status: 500 }
    );
  }
}