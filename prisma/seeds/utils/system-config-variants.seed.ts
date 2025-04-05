import { PrismaClient } from '@prisma/client';
import { variantsData } from '../data/system-config-variants.data';

export async function seedSystemConfigVariants(prisma: PrismaClient) {
  try {
    console.log('Seeding system config variants...');

    // Create all variants in a transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      const createdVariants = [];
      
      for (const variant of variantsData.variants) {
        const createdVariant = await tx.systemConfigVariant.upsert({
          where: {
            id: variant.id,
          },
          update: {
            productId: variant.productId,
            size: variant.size,
            color: variant.color,
            model: variant.model,
            isActive: variant.isActive,
            isDeleted: variant.isDeleted,
            price: variant.price
          },
          create: {
            id: variant.id,
            productId: variant.productId,
            size: variant.size,
            color: variant.color,
            model: variant.model,
            isActive: variant.isActive,
            isDeleted: variant.isDeleted,
            price: variant.price
          }
        });
        createdVariants.push(createdVariant);
      }
      
      return createdVariants;
    }, {
      timeout: 10000, // 10 second timeout
      maxWait: 5000, // 5 second max wait
    });

    // Verify the variants were created
    const count = await prisma.systemConfigVariant.count();
    console.log(`✅ Created ${count} system config variants`);

    return result;
  } catch (error) {
    console.error('Error seeding system config variants:', error);
    throw error;
  }
} 