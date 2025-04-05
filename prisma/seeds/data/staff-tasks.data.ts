import { tasksData } from './tasks.data';
import { usersData } from './users.data';
import { StaffTaskStatus } from '@prisma/client';

export const staffTasksData = [
  {
    id: 'stafftask001',
    userId: usersData.users.find(user => user.email === 'staff@gmail.com')?.id,
    taskId: tasksData.tasks.find(task => task.id === 'task001')?.id,
    assignedDate: new Date(),
    status: StaffTaskStatus.PENDING,
    note: 'Initial assignment',
    completedDate: null,
  },
  {
    id: 'stafftask002',
    userId: usersData.users.find(user => user.email === 'staff@gmail.com')?.id,
    taskId: tasksData.tasks.find(task => task.id === 'task002')?.id,
    assignedDate: new Date(),
    status: StaffTaskStatus.IN_PROGRESS,
    note: 'Ongoing task',
    completedDate: null,
  },
]; 