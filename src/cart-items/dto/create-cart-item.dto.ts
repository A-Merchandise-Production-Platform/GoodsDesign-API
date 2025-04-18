import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

@InputType()
export class CreateCartItemDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    designId: string

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    systemConfigVariantId: string
}
