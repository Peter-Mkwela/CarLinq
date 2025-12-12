// app/api/admin/views/route.ts
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Fetch views with listing info
    const [views, total] = await Promise.all([
      prisma.view.findMany({
        include: {
          listing: {
            select: {
              make: true,
              model: true,
              year: true
            }
          }
        },
        orderBy: { viewedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.view.count()
    ]);

    return NextResponse.json({
      views,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error fetching views:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}