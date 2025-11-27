/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CarStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user from database to check role and get ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'DEALER') {
      return NextResponse.json(
        { error: 'Only dealers can create listings' },
        { status: 403 }
      );
    }

    // Parse JSON body instead of FormData
    const body = await request.json();
    
    const {
      make,
      model,
      year,
      price,
      mileage,
      location,
      transmission,
      fuelType,
      description,
      imageUrls // This comes from UploadThing
    } = body;

    // Validate required fields
    if (!make || !model || !year || !price || !mileage || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that we have image URLs from UploadThing
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Create the listing in database with UploadThing image URLs
    const listing = await prisma.listing.create({
      data: {
        make,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        mileage: parseInt(mileage),
        location,
        transmission: transmission || 'Automatic',
        fuelType: fuelType || 'Petrol',
        description: description || 'Premium vehicle listing',
        images: imageUrls, // Use UploadThing URLs directly
        dealerId: user.id,
        status: 'AVAILABLE',
      },
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

    return NextResponse.json(
      { 
        message: 'Listing created successfully', 
        listing 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as CarStatus | null;
    
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Get listings with dealer info
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}