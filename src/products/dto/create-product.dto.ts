import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

@InputType({ description: "Create Product" })
export class CreateProductDto {
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

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    model3DUrl?: string

    @Field(() => String)
    @IsNotEmpty()
    @IsUUID()
    categoryId: string
}
