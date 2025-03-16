import { PrismaClient } from '@prisma/client';
import { productDesignsData } from '../data/product-designs.data';

export async function seedProductDesigns(prisma: PrismaClient) {
  try {
    console.log('Seeding product designs...');

    for (const design of productDesignsData.productDesigns) {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: design.userEmail }
      });

      if (!user) {
        throw new Error(`User with email ${design.userEmail} not found`);
      }

      await prisma.productDesign.upsert({
        where: { id: design.id },
        update: {
          userId: user.id,
          blankVariantId: design.blankVariantId,
          saved3DPreviewUrl: design.saved3DPreviewUrl,
          isFinalized: design.isFinalized,
          isPublic: design.isPublic,
          isTemplate: design.isTemplate
        },
        create: {
          id: design.id,
          userId: user.id,
          blankVariantId: design.blankVariantId,
          saved3DPreviewUrl: design.saved3DPreviewUrl,
          isFinalized: design.isFinalized,
          isPublic: design.isPublic,
          isTemplate: design.isTemplate
        },
      });
    }

    console.log('Product designs seeded successfully!');
  } catch (error) {
    console.error('Error seeding product designs:', error);
    throw error;
  }
}