import { PrismaClient } from '@prisma/client';
import { factoryProductsData } from '../data/factory-products.data';

export async function seedFactoryProducts(prisma: PrismaClient) {
  console.log('Seeding factory products...');
  
  for (const factoryProduct of factoryProductsData) {
    await prisma.factoryProduct.create({
      data: factoryProduct,
    });
  }

  console.log('Factory products seeded successfully!');
} 