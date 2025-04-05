import { ObjectType, Field, Int } from "@nestjs/graphql"
import { SystemConfigVariant } from "@prisma/client"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { SystemConfigVariantEntity } from "src/system-config-variant/entities/system-config-variant.entity"

@ObjectType()
export class FactoryProductEntity {
    @Field(() => String)
    factoryId: string

    @Field(() => String)
    systemConfigVariantId: string

    @Field(() => Int)
    productionCapacity: number

    @Field(() => Int)
    estimatedProductionTime: number

    @Field(() => FactoryEntity, { nullable: true })
    factory?: FactoryEntity

    @Field(() => SystemConfigVariantEntity, { nullable: true })
    systemConfigVariant?: SystemConfigVariantEntity

    constructor(partial: Partial<FactoryProductEntity>) {
        Object.assign(this, partial)
    }
}
