import { PrismaClient } from '@prisma/client';
import { factoryOrdersData } from '../data/factory-orders.data';

export async function seedFactoryOrders(prisma: PrismaClient) {
  console.log('Seeding factory orders...');
  
  for (const factoryOrder of factoryOrdersData) {
    await prisma.factoryOrder.create({
      data: {
        id: factoryOrder.id,
        status: factoryOrder.status,
        estimatedCompletionDate: factoryOrder.estimatedCompletionDate,
        totalItems: factoryOrder.totalItems,
        totalProductionCost: factoryOrder.totalProductionCost,
        factory: {
          connect: {
            factoryOwnerId: factoryOrder.factoryId
          }
        }
      },
    });
  }

  console.log('Factory orders seeded successfully!');
} 