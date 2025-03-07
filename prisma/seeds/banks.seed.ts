import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export const seedBanks = async (prisma: PrismaClient) => {
  const banksFilePath = path.join(__dirname, 'system-config-banks.seed.json');
  const banksData = JSON.parse(fs.readFileSync(banksFilePath, 'utf-8'));

  console.log('Seeding system config banks...');
  
  for (const bank of banksData) {
    await prisma.systemConfigBank.upsert({
      where: { id: bank.id },
      update: bank,
      create: {
        ...bank,
        support: 0,
        isTransfer: bank.transferSupported,
        isActive: true,
        createdBy: 'system',
      },
    });
  }

  console.log('System config banks seeded!');
};