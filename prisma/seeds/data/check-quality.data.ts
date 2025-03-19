import { tasksData } from './tasks.data';

export const checkQualitiesData = [
  {
    id: 'checkquality001',
    taskId: tasksData.tasks.find(task => task.id === 'task001')?.id,
    orderDetailId: 'detail001',
    totalChecked: 2,
    passedQuantity: 2,
    failedQuantity: 0,
    status: 'COMPLETED',
    reworkRequired: false,
    note: 'Quality check completed successfully',
    checkedAt: new Date(),
  },
  {
    id: 'checkquality002',
    taskId: tasksData.tasks.find(task => task.id === 'task002')?.id,
    orderDetailId: 'detail002',
    totalChecked: 3,
    passedQuantity: 2,
    failedQuantity: 1,
    status: 'IN_PROGRESS',
    reworkRequired: true,
    note: 'Rework required for some items',
    checkedAt: new Date(),
  },
]; 