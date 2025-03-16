import { PrismaClient } from '@prisma/client';
import { tasksData } from '../data/tasks.data';
import { usersData } from '../data/users.data';

enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

const prisma = new PrismaClient();

async function main() {
  const staffTasks = [
    {
      id: 'stafftask001',
      userId: usersData.users.find(user => user.email === 'staff@gmail.com')?.id,
      taskId: tasksData.tasks.find(task => task.id === 'task001')?.id,
      assignedDate: new Date(),
      status: TaskStatus.PENDING,
      note: 'Initial assignment',
      completedDate: null,
    },
    {
      id: 'stafftask002',
      userId: usersData.users.find(user => user.email === 'staff@gmail.com')?.id,
      taskId: tasksData.tasks.find(task => task.id === 'task002')?.id,
      assignedDate: new Date(),
      status: TaskStatus.IN_PROGRESS,
      note: 'Ongoing task',
      completedDate: null,
    },
  ];

  for (const staffTask of staffTasks) {
    await prisma.staffTask.create({
      data: staffTask,
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