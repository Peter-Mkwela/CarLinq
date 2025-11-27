import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all unique values for filters from the database using actual schema fields
    const [
      makes,
      models,
      locations,
      transmissions,
      fuelTypes,
      years
    ] = await Promise.all([
      prisma.listing.findMany({
        distinct: ['make'],
        select: { make: true },
        where: { status: 'AVAILABLE' }
      }),
      prisma.listing.findMany({
        distinct: ['model'],
        select: { model: true },
        where: { status: 'AVAILABLE' }
      }),
      prisma.listing.findMany({
        distinct: ['location'],
        select: { location: true },
        where: { status: 'AVAILABLE' }
      }),
      prisma.listing.findMany({
        distinct: ['transmission'],
        select: { transmission: true },
        where: { 
          status: 'AVAILABLE',
          transmission: { not: null }
        }
      }),
      prisma.listing.findMany({
        distinct: ['fuelType'],
        select: { fuelType: true },
        where: { 
          status: 'AVAILABLE',
          fuelType: { not: null }
        }
      }),
      prisma.listing.findMany({
        distinct: ['year'],
        select: { year: true },
        where: { status: 'AVAILABLE' },
        orderBy: { year: 'desc' }
      })
    ]);

    const filterOptions = {
      makes: makes.map(item => item.make).filter(Boolean).sort(),
      models: models.map(item => item.model).filter(Boolean).sort(),
      locations: locations.map(item => item.location).filter(Boolean).sort(),
      transmissions: transmissions.map(item => item.transmission).filter(Boolean).sort(),
      fuelTypes: fuelTypes.map(item => item.fuelType).filter(Boolean).sort(),
      years: years.map(item => item.year).filter(Boolean).sort((a, b) => b - a)
    };

    return NextResponse.json({ 
      filterOptions 
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}