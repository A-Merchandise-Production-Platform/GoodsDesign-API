import { PrismaClient } from '@prisma/client';
import { staffTasksData } from '../data/staff-tasks.data';

export async function seedStaffTasks(prisma: PrismaClient) {
  console.log('Seeding staff tasks...');
  
  for (const staffTask of staffTasksData) {
    await prisma.staffTask.create({
      data: staffTask,
    });
  }

  console.log('Staff tasks seeded successfully!');
}