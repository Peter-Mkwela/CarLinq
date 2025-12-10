import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    // Get favorites with full listing details
    const favorites = await prisma.favorite.findMany({
      where: { sessionId },
      include: {
        listing: {
          include: {
            dealer: {
              select: {
                name: true,
                companyName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to match your CarListing interface
    const favoriteCars = favorites.map(fav => ({
      id: fav.listing.id,
      make: fav.listing.make,
      model: fav.listing.model,
      year: fav.listing.year,
      price: fav.listing.price,
      mileage: fav.listing.mileage,
      transmission: fav.listing.transmission || 'Automatic',
      fuelType: fav.listing.fuelType || 'Petrol',
      location: fav.listing.location,
      images: fav.listing.images || [],
      status: fav.listing.status,
      views: fav.listing.viewCount || 0,
      inquiries: fav.listing.inquiryCount || 0,
      dealer: {
        companyName: fav.listing.dealer.companyName || fav.listing.dealer.name,
        phone: fav.listing.dealer.phone || 'Not provided',
        name: fav.listing.dealer.name
      }
    }));

    return NextResponse.json({ 
      favorites: favoriteCars,
      count: favorites.length 
    });
    
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}