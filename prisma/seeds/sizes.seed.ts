import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export const seedSizes = async (prisma: PrismaClient, userId?: string) => {
  const sizesFilePath = path.join(__dirname, 'system-config-sizes.seed.json');
  const defaultSizes = JSON.parse(fs.readFileSync(sizesFilePath, 'utf-8'));

  console.log('Seeding system config sizes...');

  for (const size of defaultSizes) {
    await prisma.systemConfigSize.upsert({
      where: { code: size.code },
      update: {},
      create: {
        ...size,
        createdBy: userId || 'system',
      },
    });
  }

  console.log('System config sizes seeded!');
};