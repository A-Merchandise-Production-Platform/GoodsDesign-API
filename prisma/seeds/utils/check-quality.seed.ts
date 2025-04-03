import { PrismaClient } from '@prisma/client';
import { checkQualityData } from '../data/check-quality.data';

export async function seedCheckQualities(prisma: PrismaClient) {
  console.log('Seeding check qualities...');
  
  for (const checkQuality of checkQualityData.checkQualities) {
    const { taskId, orderDetailId, factoryOrderDetailId, ...checkQualityData } = checkQuality;
    await prisma.checkQuality.create({
      data: {
        ...checkQualityData,
        task: {
          connect: {
            id: taskId
          }
        },
        orderDetail: {
          connect: {
            id: orderDetailId
          }
        },
        factoryOrderDetail: factoryOrderDetailId ? {
          connect: {
            id: factoryOrderDetailId
          }
        } : undefined
      },
    });
  }

  console.log('Check qualities seeded successfully!');
}