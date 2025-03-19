import { PrismaClient } from '@prisma/client';
import { positionTypesData } from '../data/product-position-types.data';

export async function seedProductPositionTypes(prisma: PrismaClient) {
  console.log('Seeding product position types...');
  
  for (const positionType of positionTypesData.positionTypes) {
    await prisma.productPositionType.create({
      data: positionType,
    });
  }

  console.log('Product position types seeded successfully!');
} 