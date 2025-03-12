import { PrismaClient } from '@prisma/client';
import positionTypesData from './data/product-position-types.data.json';

export async function seedProductPositionTypes(prisma: PrismaClient) {
  try {
    console.log('Seeding product position types...');

    for (const positionType of positionTypesData.positionTypes) {
      await prisma.productPositionType.create({
        data: {
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