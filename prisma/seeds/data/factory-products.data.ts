import { factoriesData } from "./factories.data"
import { variantsData } from "./system-config-variants.data"

export const factoryProductsData = [
    ...variantsData.variants.map((v, index) => {
        return {
            factoryId: factoriesData[0].factoryOwnerId,
            systemConfigVariantId: v.id,
            productionCapacity: 520,
            productionTimeInMinutes: 300
        }
    }),
    ...variantsData.variants.map((v, index) => {
        return {
            factoryId: factoriesData[1].factoryOwnerId,
            systemConfigVariantId: v.id,
            productionCapacity: 500,
            productionTimeInMinutes: 280
        }
    }),
    ...variantsData.variants.map((v, index) => {
        return {
            factoryId: factoriesData[2].factoryOwnerId,
            systemConfigVariantId: v.id,
            productionCapacity: 490,
            productionTimeInMinutes: 270
        }
    })
]
