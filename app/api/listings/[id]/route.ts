// app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CarStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'DEALER') {
      return NextResponse.json({ error: 'Only dealers can update listings' }, { status: 403 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Normalize to uppercase to match Prisma enum
    const normalizedStatus = status.toUpperCase() as CarStatus;
    const validStatuses: CarStatus[] = ['AVAILABLE', 'PENDING', 'SOLD'];

    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Verify the listing belongs to this dealer
    const existingListing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existingListing.dealerId !== user.id) {
      return NextResponse.json({ error: 'You can only update your own listings' }, { status: 403 });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status: normalizedStatus }, // ✅ FIXED: Added 'data:' property
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

    return NextResponse.json({ 
      message: 'Status updated successfully',
      listing: updatedListing 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating listing status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const listingId = params.id;

    const deletedListing = await prisma.listing.deleteMany({
      where: {
        id: listingId,
        dealerId: user.id,
      },
    });

    if (deletedListing.count === 0) {
      return NextResponse.json({ error: 'Listing not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}