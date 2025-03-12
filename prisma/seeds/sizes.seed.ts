import { PrismaClient } from '@prisma/client';
import { sizesData } from './data/system-config-sizes.data';

export const seedSizes = async (prisma: PrismaClient) => {
  console.log('Seeding system config sizes...');

  // Delete all existing records first
  await prisma.systemConfigSize.deleteMany({});

  for (const size of sizesData.sizes) {
    await prisma.systemConfigSize.upsert({
      where: { code: size.code },
      update: {},
      create: {
        ...size,
        createdBy: 'system',
      },
    });
  }

  console.log('System config sizes seeded!');
};