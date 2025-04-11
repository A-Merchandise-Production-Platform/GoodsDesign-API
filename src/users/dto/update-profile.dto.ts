import { Field, InputType } from "@nestjs/graphql"
import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator"

@InputType()
export class UpdateProfileDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @Field(() => Date)
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date

    @Field(() => Boolean)
    @IsBoolean()
    @IsNotEmpty()
    gender: boolean
}
