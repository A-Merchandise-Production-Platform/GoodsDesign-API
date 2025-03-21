import { InputType, Field } from "@nestjs/graphql"
import { Roles } from "@prisma/client"
import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength
} from "class-validator"

@InputType({ description: "Create user input" })
export class CreateUserDto {
    @Field(() => String)
    @IsEmail()
    email: string

    @Field(() => String)
    @IsString()
    name: string

    @Field(() => String)
    @IsString()
    @MinLength(6)
    password: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    phoneNumber?: string

    @Field(() => Boolean, { nullable: true, defaultValue: false })
    @IsBoolean()
    @IsOptional()
    gender?: boolean

    @Field(() => String, { nullable: true })
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    imageUrl?: string

    @Field(() => String, { nullable: true })
    @IsEnum(Roles)
    role: Roles
}
