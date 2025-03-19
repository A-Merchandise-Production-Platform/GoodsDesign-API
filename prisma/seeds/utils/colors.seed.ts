import { PrismaClient } from '@prisma/client';
import { colorsData } from '../data/system-config-colors.data';

export const seedColors = async (prisma: PrismaClient) => {
  console.log('Seeding system config colors...');

  // Delete all existing records first
  await prisma.systemConfigColor.deleteMany({});

  for (const color of colorsData.colors) {
    await prisma.systemConfigColor.create({
      data: {
        name: color.name,
        code: color.code,
        isActive: true,
        isDeleted: false
      },
    });
  }

  console.log('System config colors seeded!');
};