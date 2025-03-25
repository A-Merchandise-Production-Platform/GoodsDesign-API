import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "src/categories/entities/categories.entity"
import { BlankVariancesEntity } from "src/blank-variances/entities/blank-variances.entity"
import { ProductPositionTypeEntity } from "src/product-position-type/entities/product-position-type.entity"
import { SystemConfigDiscountEntity } from "src/system-config-discount/entities/system-config-discount.entity"

@ObjectType({ description: "Product" })
export class ProductEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    name: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => String, { nullable: true })
    imageUrl?: string

    @Field(() => String, { nullable: true })
    model3DUrl?: string

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => String, { nullable: true })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    updatedBy?: string

    @Field(() => Date, { nullable: true })
    deletedAt?: Date

    @Field(() => String, { nullable: true })
    deletedBy?: string

    @Field(() => String)
    categoryId: string

    @Field(() => CategoryEntity, { nullable: true })
    category?: CategoryEntity

    @Field(() => [BlankVariancesEntity], { nullable: true })
    blankVariances?: BlankVariancesEntity[]

    @Field(() => [ProductPositionTypeEntity], { nullable: true })
    positionTypes?: ProductPositionTypeEntity[]

    @Field(() => [SystemConfigDiscountEntity], { nullable: true })
    discounts?: SystemConfigDiscountEntity[]

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial)
    }
}
