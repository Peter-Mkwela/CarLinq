/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  }
}

// GET specific user
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        phone: true,
        companyName: true,
        address: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            listings: true,
            accounts: true
          }
        },
        listings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH - Update user
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, phone, companyName, address, role, isVerified } = body;

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (address !== undefined) updateData.address = address;
    if (role && ['ADMIN', 'DEALER'].includes(role)) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        phone: true,
        companyName: true,
        address: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if trying to delete self
    if (params.id === session.user.id) {
      return new NextResponse('Cannot delete your own account', { status: 400 });
    }

    // Delete user and all related data
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return new NextResponse('User not found', { status: 404 });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}