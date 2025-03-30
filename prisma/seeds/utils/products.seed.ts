import { PrismaClient } from '@prisma/client';
import { productsData } from '../data/products.data';

export const seedProducts = async (prisma: PrismaClient) => {
  console.log('Seeding products...');
  
  for (const product of productsData.products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        model3DUrl: product.model3DUrl,
        weight: product.weight,
        isActive: product.isActive,
        categoryId: product.categoryId
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        model3DUrl: product.model3DUrl,
        weight: product.weight,
        isActive: product.isActive,
        categoryId: product.categoryId,
        createdBy: 'system'
      },
    });
  }

  console.log('Products seeded!');
};