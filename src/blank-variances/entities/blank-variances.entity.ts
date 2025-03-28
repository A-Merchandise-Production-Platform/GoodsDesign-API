import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ProductEntity } from "src/products/entities/products.entity"
import { SystemConfigVariant } from "src/system-config-variant/entities/system-config-variant.entity"

@ObjectType({ description: "Blank Variances" })
export class BlankVariancesEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    productId: string

    @Field(() => String)
    systemVariantId: string

    @Field(() => Int)
    blankPrice: number

    @Field(() => ProductEntity)
    product: ProductEntity

    @Field(() => SystemConfigVariant)
    systemVariant: SystemConfigVariant

    constructor(partial: Partial<BlankVariancesEntity>) {
        Object.assign(this, partial)
    }
}
