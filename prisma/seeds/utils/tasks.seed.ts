import { PrismaClient } from '@prisma/client';
import { tasksData } from '../data/tasks.data';

export const seedTasks = async (prisma: PrismaClient) => {
  console.log('Seeding tasks...');
  
  // Delete all existing records first
  await prisma.task.deleteMany({});

  for (const task of tasksData.tasks) {
    await prisma.task.create({
      data: {
        id: task.id,
        description: task.description,
        taskname: task.taskname,
        status: task.status,
        startDate: new Date(task.startDate),
        expiredTime: new Date(task.expiredTime),
        qualityCheckStatus: task.qualityCheckStatus
      },
    });
  }

  console.log('Tasks seeded!');
};