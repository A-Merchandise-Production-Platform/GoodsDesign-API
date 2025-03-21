import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class CartItemEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    userId: string

    @Field(() => String)
    designId: string

    @Field(() => Int)
    quantity: number

    @Field(() => Date)
    createdAt: Date

    constructor(partial: Partial<CartItemEntity>) {
        Object.assign(this, partial)
    }
}
