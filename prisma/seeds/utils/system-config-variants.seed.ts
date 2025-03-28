import { PrismaClient } from '@prisma/client';
import { variantsData } from '../data/system-config-variants.data';

export async function seedSystemConfigVariants(prisma: PrismaClient) {
  try {
    console.log('Seeding system config variants...');

    // Create all variants in a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      for (const variant of variantsData.variants) {
        await tx.systemConfigVariant.upsert({
          where: {
            id: variant.id,
          },
          update: {
            productId: variant.productId,
            size: variant.size,
            color: variant.color,
            model: variant.model,
            isActive: variant.isActive,
            isDeleted: variant.isDeleted
          },
          create: {
            id: variant.id,
            productId: variant.productId,
            size: variant.size,
            color: variant.color,
            model: variant.model,
            isActive: variant.isActive,
            isDeleted: variant.isDeleted
          }
        });
      }
    });

    // Verify the variants were created
    const count = await prisma.systemConfigVariant.count();
    console.log(`✅ Created ${count} system config variants`);

  } catch (error) {
    console.error('Error seeding system config variants:', error);
    throw error;
  }
} 