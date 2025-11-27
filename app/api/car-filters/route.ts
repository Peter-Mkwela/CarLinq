// app/api/car-filters/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔄 Fetching filter options from database...');

    // Get all listings first, then extract unique values
    const listings = await prisma.listing.findMany({
      where: { status: 'AVAILABLE' },
      select: {
        make: true,
        model: true,
        location: true,
        transmission: true,
        fuelType: true,
        year: true,
      },
    });

    console.log(`📊 Found ${listings.length} listings for filters`);

    // Extract unique values using Set
    const filterOptions = {
      makes: Array.from(new Set(listings.map(l => l.make).filter(Boolean))).sort(),
      models: Array.from(new Set(listings.map(l => l.model).filter(Boolean))).sort(),
      locations: Array.from(new Set(listings.map(l => l.location).filter(Boolean))).sort(),
      transmissions: Array.from(new Set(listings.map(l => l.transmission).filter(Boolean))).sort(),
      fuelTypes: Array.from(new Set(listings.map(l => l.fuelType).filter(Boolean))).sort(),
      years: Array.from(new Set(listings.map(l => l.year).filter(Boolean))).sort((a, b) => b - a),
    };

    console.log('✅ Filter options generated successfully');

    return NextResponse.json({ 
      filterOptions 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('❌ Error fetching filter options:', error);
    
    // Return empty filter options instead of failing
    return NextResponse.json({ 
      filterOptions: {
        makes: [],
        models: [],
        locations: [],
        transmissions: [],
        fuelTypes: [],
        years: []
      }
    }, {
      status: 200, // Return 200 so frontend doesn't break
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}