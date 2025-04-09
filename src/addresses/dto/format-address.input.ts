import { InputType, Field } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

@InputType({ description: "Format Address Input" })
export class FormatAddressInput {
    @Field(() => Number)
    @IsNotEmpty()
    @IsNumber()
    provinceID: number

    @Field(() => Number)
    @IsNotEmpty()
    @IsNumber()
    districtID: number

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    wardCode: string

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    street: string
}
