import { Field, InputType, Float, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator"

@InputType()
export class CreateSystemConfigDiscountDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    minQuantity: number

    @Field(() => Float)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(1)
    discountPercent: number

    @Field()
    @IsNotEmpty()
    @IsString()
    productId: string
}
