import { PrismaClient } from '@prisma/client';
import { sizesData } from '../data/system-config-sizes.data';

export const seedSizes = async (prisma: PrismaClient) => {
  console.log('Seeding system config sizes...');

  // Delete all existing records first
  await prisma.systemConfigSize.deleteMany({});

  for (const size of sizesData.sizes) {
    await prisma.systemConfigSize.create({
      data: {
        name: size.name,
        code: size.code,
        isActive: true,
        isDeleted: false
      },
    });
  }

  console.log('System config sizes seeded!');
};