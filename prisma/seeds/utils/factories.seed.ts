import { PrismaClient } from '@prisma/client';
import { factoriesData } from '../data/factories.data';

export async function seedFactories(prisma: PrismaClient) {
  console.log('Seeding factories...');
  
  for (const factory of factoriesData) {
    const user = await prisma.user.findUnique({
      where: { id: factory.factoryOwnerId }
    });

    if (!user) {
      console.log(`User with ID ${factory.factoryOwnerId} not found. Skipping factory creation.`);
      continue;
    }

    await prisma.factory.create({
      data: {
        factoryOwnerId: user.id,
        information: factory.information,
        contract: factory.contract,
      },
    });
  }

  console.log('Factories seeded successfully!');
} 