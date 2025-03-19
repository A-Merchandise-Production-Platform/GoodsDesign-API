import { blankVariancesData } from './blank-variances.data';
import { factoriesData } from './factories.data';

export const factoryProductsData = [
  {
    id: 'factoryproduct001',
    factoryId: factoriesData[0].factoryOwnerId,
    blankVarianceId: blankVariancesData.blankVariances[0].id,
    productionCapacity: 1000,
    estimatedProductionTime: 7, // days
  },
  {
    id: 'factoryproduct002',
    factoryId: factoriesData[0].factoryOwnerId,
    blankVarianceId: blankVariancesData.blankVariances[1].id,
    productionCapacity: 800,
    estimatedProductionTime: 5, // days
  },
]; 