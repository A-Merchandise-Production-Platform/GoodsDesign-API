import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MinLength } from "class-validator"

@InputType({ description: "Register input" })
export class RegisterDto {
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
}
