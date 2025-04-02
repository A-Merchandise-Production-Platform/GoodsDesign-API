import { FactoryOrderStatus } from '@prisma/client';
import { factoriesData } from './factories.data';

export const factoryOrdersData = {
  factoryOrders: [
    {
      id: 'factoryorder001',
      factoryId: 'factory-id',
      customerOrderId: 'order001',
      status: FactoryOrderStatus.COMPLETED,
      assignedAt: new Date('2023-03-01T08:00:00.000Z'),
      acceptanceDeadline: new Date('2023-03-02T08:00:00.000Z'),
      acceptedAt: new Date('2023-03-01T10:30:00.000Z'),
      estimatedCompletionDate: new Date('2023-03-15T17:00:00.000Z'),
      completedAt: new Date('2023-03-14T16:45:00.000Z'),
      shippedAt: new Date('2023-03-15T09:15:00.000Z'),
      totalItems: 2,
      totalProductionCost: 100000,
      currentProgress: 100,
      isDelayed: false,
    },
    {
      id: 'factoryorder002',
      factoryId: 'factory-id',
      customerOrderId: 'order002',
      status: FactoryOrderStatus.IN_PRODUCTION,
      assignedAt: new Date('2023-03-05T09:00:00.000Z'),
      acceptanceDeadline: new Date('2023-03-06T09:00:00.000Z'),
      acceptedAt: new Date('2023-03-05T11:15:00.000Z'),
      estimatedCompletionDate: new Date('2023-03-20T17:00:00.000Z'),
      totalItems: 3,
      totalProductionCost: 150000,
      currentProgress: 45,
      isDelayed: false,
    },
    {
      id: 'factoryorder003',
      factoryId: 'factory-id',
      customerOrderId: 'order003',
      status: FactoryOrderStatus.PENDING_ACCEPTANCE,
      assignedAt: new Date('2023-03-10T10:00:00.000Z'),
      acceptanceDeadline: new Date('2023-03-11T10:00:00.000Z'),
      totalItems: 1,
      totalProductionCost: 50000,
      currentProgress: 0,
      isDelayed: false,
    },
  ],
}; 