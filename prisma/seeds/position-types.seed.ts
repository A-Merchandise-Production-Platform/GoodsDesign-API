import { PrismaClient } from '@prisma/client';
import { positionTypesData } from './data/product-position-types.data';

export async function seedProductPositionTypes(prisma: PrismaClient) {
  try {
    console.log('Seeding product position types...');

    for (const positionType of positionTypesData.positionTypes) {
      await prisma.productPositionType.upsert({
        where: { id: positionType.id },
        update: {
          productId: positionType.productId,
          positionName: positionType.positionName,
          basePrice: positionType.basePrice,
        },
        create: {
          id: positionType.id,
          productId: positionType.productId,
          positionName: positionType.positionName,
          basePrice: positionType.basePrice,
        },
      });
    }

    console.log('Product position types seeding completed.');
  } catch (error) {
    console.error('Error seeding product position types:', error);
    throw error;
  }
}