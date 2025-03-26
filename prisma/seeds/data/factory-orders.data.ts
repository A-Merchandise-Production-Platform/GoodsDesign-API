import { FactoryOrderStatus } from '@prisma/client';
import { factoriesData } from './factories.data';

export const factoryOrdersData = [
  {
    id: 'factoryorder001',
    factoryId: factoriesData[0].factoryOwnerId,
    status: FactoryOrderStatus.ACCEPTED,
    estimatedCompletionDate: new Date('2024-04-01'),
    totalItems: 100,
    totalProductionCost: 5000,
  },
  {
    id: 'factoryorder002',
    factoryId: factoriesData[0].factoryOwnerId,
    status: FactoryOrderStatus.IN_PRODUCTION,
    estimatedCompletionDate: new Date('2024-04-15'),
    totalItems: 50,
    totalProductionCost: 2500,
  },
]; 