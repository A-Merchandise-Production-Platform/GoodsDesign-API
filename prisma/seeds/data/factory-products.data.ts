import { factoriesData } from './factories.data';
import { variantsData } from './system-config-variants.data';

export const factoryProductsData = [
  {
    id: 'factoryproduct001',
    factoryId: factoriesData[0].factoryOwnerId,
    systemConfigVariantId: variantsData.variants[0].id,
    productionCapacity: 1000,
    estimatedProductionTime: 7, // days
  },
  {
    id: 'factoryproduct002',
    factoryId: factoriesData[0].factoryOwnerId,
    systemConfigVariantId: variantsData.variants[1].id,
    productionCapacity: 800,
    estimatedProductionTime: 5, // days
  },
]; 