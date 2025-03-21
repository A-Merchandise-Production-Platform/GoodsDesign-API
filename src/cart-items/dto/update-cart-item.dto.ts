import { Field, InputType, Int } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, Min } from "class-validator"

@InputType()
export class UpdateCartItemDto {
    @Field(() => Int)
    @ApiProperty({
        description: "The new quantity for the cart item",
        example: 1,
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    quantity: number
}