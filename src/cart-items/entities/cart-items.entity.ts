import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@ObjectType()
export class CartItemEntity {
    @Field(() => ID)
    @ApiProperty({
        description: "The unique identifier of the cart item",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @Field(() => String)
    @ApiProperty({
        description: "The ID of the user who owns this cart item",
        example: "user-123"
    })
    userId: string

    @Field(() => String)
    @ApiProperty({
        description: "The ID of the design in this cart item",
        example: "design-123"
    })
    designId: string

    @Field(() => Int)
    @ApiProperty({
        description: "The quantity of the item in cart",
        example: 1
    })
    quantity: number

    @Field(() => Date)
    @ApiProperty({
        description: "The date and time when the cart item was created",
        example: "2024-03-05T00:00:00.000Z"
    })
    createdAt: Date

    constructor(partial: Partial<CartItemEntity>) {
        Object.assign(this, partial)
    }
}