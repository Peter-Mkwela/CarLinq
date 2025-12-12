/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is ADMIN
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get current date and 30 days ago for growth calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prevThirtyDaysAgo = new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all stats in parallel
    const [
      totalUsers,
      totalDealers,
      verifiedDealers,
      totalListings,
      activeListings,
      soldListings,
      pendingListings,
      totalViews,
      totalInquiries,
      pendingVerifications,
      recentInquiries
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total dealers
      prisma.user.count({ where: { role: 'DEALER' } }),
      
      // Verified dealers
      prisma.user.count({ where: { role: 'DEALER', isVerified: true } }),
      
      // Total listings
      prisma.listing.count(),
      
      // Active listings
      prisma.listing.count({ where: { status: 'AVAILABLE' } }),
      
      // Sold listings
      prisma.listing.count({ where: { status: 'SOLD' } }),
      
      // Pending listings
      prisma.listing.count({ where: { status: 'PENDING' } }),
      
      // Total views
      prisma.view.count(),
      
      // Total inquiries
      prisma.inquiry.count(),
      
      // Pending verifications
      prisma.user.count({ where: { role: 'DEALER', isVerified: false } }),
      
      // Recent inquiries (last 7 days)
      prisma.inquiry.count({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate revenue from sold listings
    const soldListingsData = await prisma.listing.findMany({
      where: { status: 'SOLD' },
      select: { price: true }
    });
    
    const revenue = soldListingsData.reduce((sum, listing) => sum + listing.price, 0);

    // Calculate growth rates
    const usersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
          lt: now
        }
      }
    });

    const listingsLastMonth = await prisma.listing.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
          lt: now
        }
      }
    });

    const viewsLastMonth = await prisma.view.count({
      where: {
        viewedAt: {
          gte: thirtyDaysAgo,
          lt: now
        }
      }
    });

    const usersPreviousMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: prevThirtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    const listingsPreviousMonth = await prisma.listing.count({
      where: {
        createdAt: {
          gte: prevThirtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    const viewsPreviousMonth = await prisma.view.count({
      where: {
        viewedAt: {
          gte: prevThirtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Calculate growth percentages
    const userGrowthRate = usersPreviousMonth > 0 
      ? ((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100 
      : 0;
    
    const listingGrowthRate = listingsPreviousMonth > 0 
      ? ((listingsLastMonth - listingsPreviousMonth) / listingsPreviousMonth) * 100 
      : 0;
    
    const viewGrowthRate = viewsPreviousMonth > 0 
      ? ((viewsLastMonth - viewsPreviousMonth) / viewsPreviousMonth) * 100 
      : 0;

    // Calculate conversion rate (sold listings / total inquiries)
    const conversionRate = totalInquiries > 0 
      ? (soldListings / totalInquiries) * 100 
      : 0;

    return NextResponse.json({
      totalUsers,
      totalDealers,
      verifiedDealers,
      totalListings,
      activeListings,
      soldListings,
      pendingListings,
      totalViews,
      totalInquiries,
      recentInquiries,
      pendingVerifications,
      revenue,
      userGrowthRate: parseFloat(userGrowthRate.toFixed(1)),
      listingGrowthRate: parseFloat(listingGrowthRate.toFixed(1)),
      viewGrowthRate: parseFloat(viewGrowthRate.toFixed(1)),
      conversionRate: parseFloat(conversionRate.toFixed(1))
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}