import { Field, InputType } from "@nestjs/graphql"
import { ObjectType } from "@nestjs/graphql"
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

@InputType()
export class UpdatePhoneNumberDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string
}
