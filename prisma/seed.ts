// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const password = await bcrypt.hash("pmkwela@2001!", 10);
  console.log('✅ Password hashed');

  try {
    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: "petermkwela6@gmail.com" },
      update: {
        name: "pmkwela",
        role: "ADMIN", // Make sure this matches your UserRole enum
        password: password,
      },
      create: {
        name: "pmkwela",
        email: "petermkwela6@gmail.com",
        password: password,
        role: "ADMIN", // Make sure this matches your UserRole enum
      },
    });

    console.log("✅ Admin user created:", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

  } catch (error: any) {
    console.error('❌ Seed error:', error);
    if (error.code === 'P2002') {
      console.log('⚠️  User already exists');
    }
  }
}

main()
  .catch((e) => {
    console.error('💥 Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });