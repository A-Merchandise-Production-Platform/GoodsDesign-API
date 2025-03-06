import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export const seedColors = async (prisma: PrismaClient, userId?: string) => {
  const colorsFilePath = path.join(__dirname, 'system-config-colors.seed.json');
  const defaultColors = JSON.parse(fs.readFileSync(colorsFilePath, 'utf-8'));

  console.log('Seeding system config colors...');

  for (const color of defaultColors) {
    await prisma.systemConfigColor.upsert({
      where: { code: color.code },
      update: {},
      create: {
        ...color,
        createdBy: userId || 'system',
      },
    });
  }

  console.log('System config colors seeded!');
};