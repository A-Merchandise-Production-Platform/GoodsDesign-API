import { Field, InputType, PartialType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"
import { CreateUserDto } from "./create-user.dto"

@InputType({ description: "Update user input" })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @Field(() => String, { nullable: true })
    @IsOptional()
    updatedBy?: string
}
