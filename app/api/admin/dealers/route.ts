/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/dealers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const verified = searchParams.get('verified');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      role: 'DEALER'
    };

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add verification filter
    if (verified === 'true' || verified === 'false') {
      where.isVerified = verified === 'true';
    }

    // Fetch dealers with their listing counts
    const [dealers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { listings: true }
          },
          listings: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              price: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Format response
    const formattedDealers = dealers.map(dealer => ({
      id: dealer.id,
      name: dealer.name,
      email: dealer.email,
      phone: dealer.phone,
      companyName: dealer.companyName,
      address: dealer.address,
      isVerified: dealer.isVerified,
      role: dealer.role,
      createdAt: dealer.createdAt,
      updatedAt: dealer.updatedAt,
      listingsCount: dealer._count.listings,
      recentListings: dealer.listings
    }));

    return NextResponse.json({
      dealers: formattedDealers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching dealers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH - Update dealer verification status
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get('dealerId');
    
    if (!dealerId) {
      return new NextResponse('Dealer ID is required', { status: 400 });
    }

    const body = await req.json();
    const { isVerified } = body;

    if (typeof isVerified !== 'boolean') {
      return new NextResponse('isVerified must be a boolean', { status: 400 });
    }

    // Update dealer verification status
    const updatedDealer = await prisma.user.update({
      where: { id: dealerId, role: 'DEALER' },
      data: { isVerified },
      include: {
        _count: {
          select: { listings: true }
        }
      }
    });

    return NextResponse.json({
      id: updatedDealer.id,
      name: updatedDealer.name,
      email: updatedDealer.email,
      isVerified: updatedDealer.isVerified,
      listingsCount: updatedDealer._count.listings
    });

  } catch (error) {
    console.error('Error updating dealer:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return new NextResponse('Dealer not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE - Delete dealer
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get('dealerId');
    
    if (!dealerId) {
      return new NextResponse('Dealer ID is required', { status: 400 });
    }

    // Check if trying to delete self
    if (dealerId === session.user.id) {
      return new NextResponse('Cannot delete your own account', { status: 400 });
    }

    // Delete dealer and all related data
    await prisma.user.delete({
      where: { id: dealerId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Dealer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting dealer:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return new NextResponse('Dealer not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}