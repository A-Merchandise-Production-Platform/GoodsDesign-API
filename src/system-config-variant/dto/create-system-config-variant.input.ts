import { InputType, Field, Int } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator"

@InputType()
export class CreateSystemConfigVariantInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    size?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    color?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    model?: string

    @Field(() => Int, { nullable: true })
    @IsNotEmpty()
    @IsInt()
    price: number
}
