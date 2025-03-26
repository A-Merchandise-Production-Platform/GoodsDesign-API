import { PrismaClient } from '@prisma/client';
import { factoryOrderDetailsData } from '../data/factory-order-details.data';

export async function seedFactoryOrderDetails(prisma: PrismaClient) {
  console.log('Seeding factory order details...');
  
  for (const factoryOrderDetail of factoryOrderDetailsData) {
    await prisma.factoryOrderDetail.create({
      data: {
        id: factoryOrderDetail.id,
        designId: factoryOrderDetail.designId,
        factoryOrderId: factoryOrderDetail.factoryOrderId,
        orderDetailId: factoryOrderDetail.orderDetailId,
        quantity: factoryOrderDetail.quantity,
        status: factoryOrderDetail.status,
        price: 100, // Default price, should be copied from CustomerOrderDetail
        productionCost: factoryOrderDetail.productionCost,
        completedQty: 0,
        rejectedQty: 0
      },
    });
  }

  console.log('Factory order details seeded successfully!');
} 