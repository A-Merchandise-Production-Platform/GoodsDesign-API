import { InputType, Int, Field } from "@nestjs/graphql"
import { IsOptional, IsString, IsNumber } from "class-validator"
import { IsNotEmpty } from "class-validator"

@InputType({ description: "Create Address Input" })
export class CreateAddressInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsNumber()
    provinceID: number

    @Field(() => String)
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
    factoryId?: string
}
