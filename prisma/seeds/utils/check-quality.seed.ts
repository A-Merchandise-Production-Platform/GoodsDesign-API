import { PrismaClient } from '@prisma/client';
import { tasksData } from '../data/tasks.data';
import { usersData } from '../data/users.data';

const prisma = new PrismaClient();

async function main() {
  const checkQualities = [
    {
      id: 'checkquality001',
      taskId: tasksData.tasks.find(task => task.id === 'task001')?.id,
      orderDetailId: 'orderdetail001', // Assuming this ID exists
      totalChecked: 100,
      passedQuantity: 95,
      failedQuantity: 5,
      status: 'COMPLETED',
      reworkRequired: false,
      note: 'Quality check completed successfully',
      checkedAt: new Date(),
    },
    {
      id: 'checkquality002',
      taskId: tasksData.tasks.find(task => task.id === 'task002')?.id,
      orderDetailId: 'orderdetail002', // Assuming this ID exists
      totalChecked: 50,
      passedQuantity: 45,
      failedQuantity: 5,
      status: 'IN_PROGRESS',
      reworkRequired: true,
      note: 'Rework required for some items',
      checkedAt: new Date(),
    },
  ];

  for (const checkQuality of checkQualities) {
    await prisma.checkQuality.create({
      data: checkQuality,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });