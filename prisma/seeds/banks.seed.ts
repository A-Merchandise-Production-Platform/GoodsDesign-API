import { PrismaClient } from '@prisma/client';
import { banksData } from './data/system-config-banks.data';

export const seedBanks = async (prisma: PrismaClient) => {
  console.log('Seeding system config banks...');
  
  // Delete all existing records first
  await prisma.systemConfigBank.deleteMany({});
  
  for (const bank of banksData.banks) {
    await prisma.systemConfigBank.upsert({
          where: { code: bank.code },
          update: {
            name: bank.name,
            bin: bank.bin,
            shortName: bank.shortName,
            logo: bank.logo,
            transferSupported: bank.transferSupported,
            lookupSupported: bank.lookupSupported,
            swiftCode: bank.swiftCode,
            isTransfer: bank.transferSupported,
            isActive: true
          },
          create: {
            code: bank.code,
            name: bank.name,
            bin: bank.bin,
            shortName: bank.shortName,
            logo: bank.logo,
            transferSupported: bank.transferSupported,
            lookupSupported: bank.lookupSupported,
            swiftCode: bank.swiftCode,
            support: 0,
            isTransfer: bank.transferSupported,
            isActive: true,
            createdBy: 'system'
          },
    });
  }

  console.log('System config banks seeded!');
};