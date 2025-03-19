import { PrismaClient } from '@prisma/client';
import { banksData } from '../data/system-config-banks.data';

export const seedBanks = async (prisma: PrismaClient) => {
  console.log('Seeding system config banks...');
  
  // Delete all existing records first
  await prisma.systemConfigBank.deleteMany({});
  
  for (const bank of banksData.banks) {
    await prisma.systemConfigBank.create({
      data: {
        name: bank.name,
        code: bank.code,
        bin: bank.bin,
        shortName: bank.shortName,
        logo: bank.logo,
        isActive: true,
        isDeleted: false
      },
    });
  }

  console.log('System config banks seeded!');
};