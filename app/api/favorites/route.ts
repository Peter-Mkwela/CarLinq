// GET: Get all favorite cars for current session
export async function GET(request: NextRequest) {
  try {
    // Get session ID from query params
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    
    console.log('🔍 [API] GET /api/favorites called');
    console.log('📝 Session ID from query:', sessionId);
    
    if (!sessionId) {
      console.log('❌ No session ID provided');
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Check if database has any favorites at all
    const allFavoritesCount = await prisma.favorite.count();
    console.log('📊 Total favorites in database:', allFavoritesCount);

    // Get all favorites for this session with full car details
    const favorites = await prisma.favorite.findMany({
      where: { sessionId },
      include: {
        listing: {
          include: {
            dealer: {
              select: {
                name: true,
                companyName: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('🎯 Favorites found for session:', favorites.length);
    console.log('📋 Favorite records:', JSON.stringify(favorites, null, 2));

    // Transform the data to match your CarListing interface
    const favoriteCars = favorites.map(fav => ({
      id: fav.listing.id,
      make: fav.listing.make,
      model: fav.listing.model,
      year: fav.listing.year,
      price: fav.listing.price,
      mileage: fav.listing.mileage,
      transmission: fav.listing.transmission || 'Not specified',
      fuelType: fav.listing.fuelType || 'Not specified',
      location: fav.listing.location,
      images: fav.listing.images,
      status: fav.listing.status,
      views: fav.listing.viewCount || 0,
      inquiries: fav.listing.inquiryCount || 0,
      dealer: {
        companyName: fav.listing.dealer.companyName || fav.listing.dealer.name,
        phone: fav.listing.dealer.phone || 'Not provided',
        name: fav.listing.dealer.name
      }
    }));

    console.log('🚗 Transformed cars:', favoriteCars.length);
    console.log('📤 Sending response...');

    return NextResponse.json({ 
      favorites: favoriteCars,
      count: favorites.length 
    });
    
  } catch (error) {
    console.error('💥 Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}