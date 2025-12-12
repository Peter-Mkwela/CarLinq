/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/listings/route.ts
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const dealerId = searchParams.get('dealerId');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Add dealer filter
    if (dealerId) {
      where.dealerId = dealerId;
    }

    // Fetch listings with dealer info
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          dealer: {
            select: {
              id: true,
              name: true,
              email: true,
              companyName: true,
              isVerified: true
            }
          },
          _count: {
            select: {
              views: true,
              inquiries: true,
              favorites: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.listing.count({ where })
    ]);

    // Format response
    const formattedListings = listings.map(listing => ({
      id: listing.id,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage,
      location: listing.location,
      transmission: listing.transmission,
      fuelType: listing.fuelType,
      status: listing.status,
      description: listing.description,
      images: listing.images,
      viewCount: listing._count.views,
      inquiryCount: listing._count.inquiries,
      likeCount: listing._count.favorites,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      dealer: listing.dealer
    }));

    return NextResponse.json({
      listings: formattedListings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}