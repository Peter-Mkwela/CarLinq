/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth'; // Ensure this file exists

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { dealerName, companyName, email, password, phone } = await request.json();

    // Validate input
    if (!dealerName || !companyName || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // ✅ Use 'DEALER' string literal, NOT UserRole.DEALER
    const dealer = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: dealerName.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        role: 'DEALER', // 🔑 Critical fix
        isVerified: false,
      },
    });

    console.log('Dealer registered successfully:', dealer.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Dealer account created successfully',
        dealer: {
          id: dealer.id,
          dealerName: dealer.name,
          companyName: dealer.companyName,
          email: dealer.email,
          phone: dealer.phone,
          isVerified: dealer.isVerified,
          role: dealer.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Dealer registration error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Optional: log unknown errors for debugging
    return NextResponse.json(
      { error: 'Failed to register dealer. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}