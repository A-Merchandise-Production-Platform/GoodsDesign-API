import { PrismaClient } from '@prisma/client';
import { factoryOrdersData } from '../data/factory-orders.data';

export async function seedFactoryOrders(prisma: PrismaClient) {
  console.log('Seeding factory orders...');
  
  for (const factoryOrder of factoryOrdersData.factoryOrders) {
    await prisma.factoryOrder.create({
      data: {
        id: factoryOrder.id,
        status: factoryOrder.status,
        estimatedCompletionDate: factoryOrder.estimatedCompletionDate,
        totalItems: factoryOrder.totalItems,
        totalProductionCost: factoryOrder.totalProductionCost,
        assignedAt: new Date(),
        acceptanceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        factory: {
          connect: {
            factoryOwnerId: factoryOrder.factoryId
          }
        },
        customerOrder: {
          connect: {
            id: 'order001' // You'll need to provide a valid customer order ID
          }
        }
      },
    });
  }

  console.log('Factory orders seeded successfully!');
} 