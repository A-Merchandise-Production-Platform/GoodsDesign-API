import { PrismaClient } from '@prisma/client';
const { seedBanks } = require('./seeds/banks.seed');
const { seedColors } = require('./seeds/colors.seed');
const { seedSizes } = require('./seeds/sizes.seed');
const { seedUsers } = require('./seeds/users.seed');

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed users
    await seedUsers(prisma);
    // Seed system configurations
    await seedBanks(prisma);
    await seedColors(prisma);
    await seedSizes(prisma);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
