import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsBoolean } from "class-validator"
@InputType()
export class CreateSystemConfigBankDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field()
    @IsNotEmpty()
    @IsString()
    code: string

    @Field()
    @IsNotEmpty()
    @IsString()
    bin: string

    @Field()
    @IsNotEmpty()
    @IsString()
    shortName: string

    @Field()
    @IsNotEmpty()
    @IsString()
    logo: string

    @Field({ defaultValue: true })
    @IsNotEmpty()
    @IsBoolean()
    isActive?: boolean
}
