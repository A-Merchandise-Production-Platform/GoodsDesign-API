import { InputType, Field } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator"

@InputType({ description: "Create User Bank Input" })
export class CreateUserBankInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    bankId: string

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    accountNumber: string

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    accountName: string

    @Field(() => Boolean, { defaultValue: false })
    @IsBoolean()
    @IsOptional()
    isDefault?: boolean
} 