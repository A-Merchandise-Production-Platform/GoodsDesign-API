import { PrismaClient } from '@prisma/client';
import { variantsData } from '../data/system-config-variants.data';

export async function seedSystemConfigVariants(prisma: PrismaClient) {
  try {
    console.log('Seeding system config variants...');

    for (const variant of variantsData.variants) {
      // Check if variant with same name exists for the product
      const existingVariant = await prisma.systemConfigVariant.findFirst({
        where: {
          productId: variant.productId,
          name: variant.name,
          isDeleted: false
        }
      });

      if (!existingVariant) {
        await prisma.systemConfigVariant.create({
          data: {
            name: variant.name,
            value: variant.value,
            productId: variant.productId,
            isActive: true,
            isDeleted: false
          }
        });
        console.log(`✅ Created variant: ${variant.name} for product: ${variant.productId}`);
      } else {
        console.log(
          `⏩ Variant ${variant.name} for product ${variant.productId} already exists, skipping...`
        );
      }
    }

    console.log('✅ System config variants seeded successfully!');
  } catch (error) {
    console.error('Error seeding system config variants:', error);
    throw error;
  }
} 