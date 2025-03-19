import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsString, MinLength } from "class-validator"

@InputType({ description: "Login input" })
export class LoginDto {
    @Field(() => String)
    @IsEmail()
    email: string

    @Field(() => String)
    @IsString()
    @MinLength(6)
    password: string
}
