import { InputType, Int, Field } from "@nestjs/graphql"
import { IsOptional, IsString, IsNumber } from "class-validator"
import { IsNotEmpty } from "class-validator"

@InputType({ description: "Create Address Input" })
export class CreateAddressInput {
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

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    formattedAddress?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    factoryId?: string
}
