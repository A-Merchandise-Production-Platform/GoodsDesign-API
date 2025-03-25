import { Field, ID, ObjectType, Float } from "@nestjs/graphql"
import { ProductEntity } from "src/products/entities/products.entity"

@ObjectType()
export class SystemConfigDiscountEntity {
    @Field(() => ID)
    id: string

    @Field()
    name: string

    @Field()
    minQuantity: number

    @Field(() => Float)
    discountPercent: number

    @Field()
    isActive: boolean

    @Field()
    isDeleted: boolean

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date

    @Field(() => ProductEntity)
    product: ProductEntity

    constructor(partial: Partial<SystemConfigDiscountEntity>) {
        Object.assign(this, partial)
    }
}
