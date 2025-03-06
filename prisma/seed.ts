import { PrismaClient } from '@prisma/client';
import { seedBanks } from './seeds/banks.seed';
import { seedColors } from './seeds/colors.seed';
import { seedSizes } from './seeds/sizes.seed';
import { seedUsers } from './seeds/users.seed';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const users = await seedUsers(prisma);

  // Seed system configurations
  await seedBanks(prisma);
  await seedColors(prisma, users.admin.id);
  await seedSizes(prisma, users.admin.id);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
