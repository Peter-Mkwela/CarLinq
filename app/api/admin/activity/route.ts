// app/api/admin/activity/route.ts
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
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get recent activity from all models
    const [
      recentListings,
      recentInquiries,
      recentViews,
      recentMessages,
      recentUsers
    ] = await Promise.all([
      // Recent listings
      prisma.listing.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          status: true,
          createdAt: true,
          dealer: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent inquiries
      prisma.inquiry.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          createdAt: true,
          listing: {
            select: {
              make: true,
              model: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent views
      prisma.view.findMany({
        where: {
          viewedAt: { gte: startDate }
        },
        select: {
          id: true,
          viewedAt: true,
          ipAddress: true,
          listing: {
            select: {
              make: true,
              model: true
            }
          }
        },
        orderBy: { viewedAt: 'desc' },
        take: 10
      }),

      // Recent contact messages
      prisma.contactMessage.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent users
      prisma.user.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return NextResponse.json({
      recentListings,
      recentInquiries,
      recentViews,
      recentMessages,
      recentUsers,
      startDate,
      endDate: new Date()
    });

  } catch (error) {
    console.error('Error fetching activity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}