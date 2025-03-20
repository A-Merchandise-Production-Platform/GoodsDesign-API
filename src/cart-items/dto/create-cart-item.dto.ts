import { Field, InputType, Int } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

@InputType()
export class CreateCartItemDto {
    @Field(() => String)
    @ApiProperty({
        description: "The ID of the design to add to cart",
        example: "design-123"
    })
    @IsNotEmpty()
    @IsString()
    designId: string

    @Field(() => Int)
    @ApiProperty({
        description: "The quantity to add to cart",
        example: 1,
        minimum: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number
}