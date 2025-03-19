import { Field, InputType, Int } from "@nestjs/graphql"
import { JsonValue } from "@prisma/client/runtime/library"
import GraphQLJSON from "graphql-type-json"
import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator"
@InputType({ description: "Create Blank Variance" })
export class CreateBlankVarianceDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    productId: string

    @Field(() => GraphQLJSON)
    @IsNotEmpty()
    @IsObject()
    information: JsonValue

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    blankPrice: number
}
