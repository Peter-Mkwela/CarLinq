// scripts/seed-admin.ts
//npx tsx scripts/seed-admin.ts

import { PrismaClient } from '.prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@carlinq.com',
        role: 'ADMIN', // ✅ Use string literal, not enum import
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('123', 12); // ✅ Hash directly

    await prisma.user.create({
      data: {
        email: 'admin@carlinq.com',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'ADMIN', // ✅ String literal
        // Optional: set other required fields if needed
        // phone, avatar, etc. can be omitted if optional in schema
      },
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@carlinq.com');
    console.log('🔑 Password: 123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();