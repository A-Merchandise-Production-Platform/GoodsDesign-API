import { PrismaClient } from '@prisma/client';
import { seedBanks, seedColors, seedSizes, seedUsers, seedCategories, seedProducts, seedTasks, seedProductPositionTypes, seedBlankVariances, seedProductDesigns } from './seeds';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed users
    await seedUsers(prisma);
    // Seed system configurations
    await seedBanks(prisma);
    await seedColors(prisma);
    await seedSizes(prisma);

    // Seed categories and products
    await seedCategories(prisma);
    await seedProducts(prisma);
    await seedProductPositionTypes(prisma);
    await seedBlankVariances(prisma);
    await seedProductDesigns(prisma);

    // Seed tasks
    await seedTasks(prisma);

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
