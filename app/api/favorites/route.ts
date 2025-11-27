import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        favorites: {
          include: {
            listing: {
              include: {
                dealer: {
                  select: {
                    companyName: true,
                    phone: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const favorites = user.favorites.map(fav => ({
      id: fav.listing.id,
      make: fav.listing.make,
      model: fav.listing.model,
      year: fav.listing.year,
      price: fav.listing.price,
      mileage: fav.listing.mileage,
      transmission: fav.listing.transmission,
      fuelType: fav.listing.fuelType,
      location: fav.listing.location,
      images: fav.listing.images,
      dealer: {
        companyName: fav.listing.dealer.companyName || fav.listing.dealer.name,
        phone: fav.listing.dealer.phone,
        name: fav.listing.dealer.name,
      },
      status: fav.listing.status.toLowerCase(),
      datePosted: fav.listing.createdAt.toISOString(),
    }));

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// Add/Remove favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listingId, action } = await request.json();

    if (!listingId || !action) {
      return NextResponse.json({ error: 'Listing ID and action are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'add') {
      // Add to favorites
      await prisma.user.update({
        where: { id: user.id },
        data: {
          favorites: {
            create: {
              listingId: listingId,
            },
          },
        },
      });
    } else if (action === 'remove') {
      // Remove from favorites
      await prisma.favorite.deleteMany({
        where: {
          userId: user.id,
          listingId: listingId,
        },
      });
    }

    return NextResponse.json({ message: 'Favorite updated successfully' });
  } catch (error) {
    console.error('Error updating favorite:', error);
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
}