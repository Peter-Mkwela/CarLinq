// app/api/admin/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  }
}

// GET single listing
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        dealer: {
          select: {
            id: true,
            name: true,
            email: true,
            companyName: true,
            phone: true,
            isVerified: true
          }
        },
        _count: {
          select: {
            views: true,
            inquiries: true,
            favorites: true
          }
        },
        views: {
          take: 10,
          orderBy: { viewedAt: 'desc' },
          select: {
            id: true,
            viewedAt: true,
            ipAddress: true,
            userAgent: true
          }
        },
        inquiries: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            message: true,
            createdAt: true
          }
        }
      }
    });

    if (!listing) {
      return new NextResponse('Listing not found', { status: 404 });
    }

    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error fetching listing:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH - Update listing status
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['AVAILABLE', 'PENDING', 'SOLD', 'UNAVAILABLE'];
    if (!status || !validStatuses.includes(status)) {
      return new NextResponse('Invalid status value', { status: 400 });
    }

    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: { status },
      include: {
        dealer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(listing);

  } catch (error) {
    console.error('Error updating listing:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return new NextResponse('Listing not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE - Delete listing
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete listing and all related data
    await prisma.listing.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting listing:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return new NextResponse('Listing not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}