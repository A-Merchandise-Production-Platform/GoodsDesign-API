import { factoriesData } from './factories.data';
import { variantsData } from './system-config-variants.data';



export const factoryProductsData = [
  ...variantsData.variants.map((v, index) => {
    return {
      id: 'factoryproduct00'+index,
      factoryId: factoriesData[0].factoryOwnerId,
      systemConfigVariantId: v.id,
      productionCapacity: 1000,
      estimatedProductionTime: 7, // days
    }
  }),
  ...variantsData.variants.map((v, index) => {
    return {
      id: 'factoryproduct-11'+index,
      factoryId: factoriesData[1].factoryOwnerId,
      systemConfigVariantId: v.id,
      productionCapacity: 500,
      estimatedProductionTime: 4, // days
    }
  }),
]; 