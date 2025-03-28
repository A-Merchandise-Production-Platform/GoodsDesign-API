import { PrismaClient } from '@prisma/client';
import { blankVariancesData } from '../data/blank-variances.data';

export async function seedBlankVariances(prisma: PrismaClient) {
  try {
    console.log('Seeding blank variances...');

    for (const variance of blankVariancesData.blankVariances) {
      await prisma.blankVariance.upsert({
        where: { id: variance.id },
        update: {
          productId: variance.productId,
          systemVariantId: variance.systemVariantId,
          blankPrice: variance.blankPrice,
        },
        create: {
          id: variance.id,
          productId: variance.productId,
          systemVariantId: variance.systemVariantId,
          blankPrice: variance.blankPrice,
        },
      });
    }

    console.log('Blank variances seeded successfully!');
  } catch (error) {
    console.error('Error seeding blank variances:', error);
    throw error;
  }
}