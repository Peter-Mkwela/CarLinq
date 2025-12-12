/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/inquiries/route.ts
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
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch inquiries with listing info
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              price: true,
              dealerId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.inquiry.count({ where })
    ]);

    // Get dealer info for each inquiry
    const inquiriesWithDealers = await Promise.all(
      inquiries.map(async (inquiry) => {
        let dealer = null;
        if (inquiry.listing?.dealerId) {
          dealer = await prisma.user.findUnique({
            where: { id: inquiry.listing.dealerId },
            select: {
              name: true,
              email: true,
              companyName: true
            }
          });
        }

        return {
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          message: inquiry.message,
          sessionId: inquiry.sessionId,
          listingId: inquiry.listingId,
          createdAt: inquiry.createdAt,
          listing: inquiry.listing,
          dealer
        };
      })
    );

    return NextResponse.json({
      inquiries: inquiriesWithDealers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}