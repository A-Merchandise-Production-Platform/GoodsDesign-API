import { InputType, Field } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

@InputType()
export class VerifyOtpInput {
    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    code: string
}
