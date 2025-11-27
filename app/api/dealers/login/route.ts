/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find dealer by email
    const dealer = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!dealer) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check role
    if (dealer.role !== UserRole.DEALER) {
      return NextResponse.json(
        { error: 'Access denied. Not a dealer account.' },
        { status: 403 }
      );
    }

    // Check if password exists
    if (!dealer.password) {
      return NextResponse.json(
        { error: 'Password not set for this account.' },
        { status: 500 }
      );
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, dealer.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check if dealer is verified
    if (!dealer.isVerified) {
      return NextResponse.json(
        { error: 'Your account is not verified yet.' },
        { status: 403 }
      );
    }

    // ✅ Success: return dealer info
    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      dealer: {
        id: dealer.id,
        name: dealer.name,
        email: dealer.email,
        companyName: dealer.companyName,
        phone: dealer.phone,
        role: dealer.role,
      },
    });
  } catch (error: any) {
    console.error('Dealer login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
