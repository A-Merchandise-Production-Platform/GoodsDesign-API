import { PrismaClient } from '@prisma/client';
import { factoryOrderDetailsData } from '../data/factory-order-details.data';

export async function seedFactoryOrderDetails(prisma: PrismaClient) {
  console.log('Seeding factory order details...');
  
  for (const factoryOrderDetail of factoryOrderDetailsData) {
    await prisma.factoryOrderDetail.create({
      data: factoryOrderDetail,
    });
  }

  console.log('Factory order details seeded successfully!');
} 