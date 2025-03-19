import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType({ description: "Create category input" })
export class CreateCategoryDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    name: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    imageUrl?: string
}
