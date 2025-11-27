import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        status: 'AVAILABLE',
      },
      include: {
        dealer: {
          select: {
            companyName: true,
            phone: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data for frontend - using REAL dealer data
    const transformedListings = listings.map(listing => ({
      id: listing.id,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage,
      transmission: listing.transmission || 'Automatic',
      fuelType: listing.fuelType || 'Petrol',
      location: listing.location,
      images: listing.images,
      dealer: {
        companyName: listing.dealer.companyName || listing.dealer.name,
        phone: listing.dealer.phone || 'Not provided',
        name: listing.dealer.name,
      },
      status: listing.status.toLowerCase(),
      datePosted: listing.createdAt.toISOString(),
      views: listing.views,
      inquiries: listing.inquiries,
    }));

    return NextResponse.json({ 
      listings: transformedListings
    });
  } catch (error) {
    console.error('Error fetching car listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car listings' },
      { status: 500 }
    );
  }
}