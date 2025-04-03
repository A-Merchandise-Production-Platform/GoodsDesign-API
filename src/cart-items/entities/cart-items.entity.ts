import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"
import { ProductDesignEntity } from "src/product-design/entities/product-design.entity"

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

    constructor(partial: Partial<CartItemEntity>) {
        Object.assign(this, partial)
    }
}
