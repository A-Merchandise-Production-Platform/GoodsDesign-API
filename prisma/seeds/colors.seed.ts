import { PrismaClient } from '@prisma/client';
import defaultColors from './data/system-config-colors.data.json';

export const seedColors = async (prisma: PrismaClient) => {
  console.log('Seeding system config colors...');

  // Delete all existing records first
  await prisma.systemConfigColor.deleteMany({});

  for (const color of defaultColors) {
    await prisma.systemConfigColor.upsert({
      where: { code: color.code },
      update: {},
      create: {
        ...color,
        createdBy: 'system',
      },
    });
  }

  console.log('System config colors seeded!');
};