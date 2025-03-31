import { PrismaClient } from '@prisma/client';
import { factoryOrderDetailsData } from '../data/factory-order-details.data';

export async function seedFactoryOrderDetails(prisma: PrismaClient) {
  console.log('Seeding factory order details...');
  
  for (const factoryOrderDetail of factoryOrderDetailsData.factoryOrderDetails) {
    await prisma.factoryOrderDetail.create({
      data: {
        id: factoryOrderDetail.id,
        designId: factoryOrderDetail.designId,
        factoryOrderId: factoryOrderDetail.factoryOrderId,
        orderDetailId: factoryOrderDetail.orderDetailId,
        quantity: factoryOrderDetail.quantity,
        status: factoryOrderDetail.status,
        price: factoryOrderDetail.price,
        productionCost: factoryOrderDetail.productionCost,
        completedQty: factoryOrderDetail.completedQty,
        rejectedQty: factoryOrderDetail.rejectedQty,
        qualityStatus: factoryOrderDetail.qualityStatus,
        qualityCheckedAt: factoryOrderDetail.qualityCheckedAt,
        qualityCheckedBy: factoryOrderDetail.qualityCheckedBy
      },
    });
  }

  console.log('Factory order details seeded successfully!');
} 