import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


@InputType({ description: "Create Blank Variance" })
export class CreateBlankVarianceDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Field()
    @IsNotEmpty()
    @IsString()
    systemVariantId: string

    @Field()
    @IsNotEmpty()
    @IsNumber()
    blankPrice: number
}
