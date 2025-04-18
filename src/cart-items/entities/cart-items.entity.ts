import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"
import { ProductDesignEntity } from "src/product-design/entities/product-design.entity"
import { SystemConfigVariantEntity } from "src/system-config-variant/entities/system-config-variant.entity"

@ObjectType()
export class CartItemEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    userId: string

    @Field(() => Int)
    quantity: number

    @Field(() => Date)
    createdAt: Date

    @Field(() => ProductDesignEntity, { nullable: true })
    @IsOptional()
    design?: ProductDesignEntity

    @Field(() => SystemConfigVariantEntity, { nullable: true })
    @IsOptional()
    systemConfigVariant?: SystemConfigVariantEntity

    constructor(partial: Partial<CartItemEntity>) {
        Object.assign(this, partial)
    }
}
