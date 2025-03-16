import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { JsonValue } from "@prisma/client/runtime/library"
import GraphQLJSON from "graphql-type-json"
import { ProductEntity } from "src/products/entities/products.entity"

@ObjectType()
export class BlankVariancesEntity {
    @Field(() => ID)
    @ApiProperty({
        description: "The unique identifier of the blank variance",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: string

    @Field(() => String)
    @ApiProperty({
        description: "The ID of the product this blank variance belongs to",
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    productId: string

    @Field(() => GraphQLJSON)
    @ApiProperty({
        description:
            "The information about the blank variance (size, color, material, stock, etc.)",
        example: {
            size: "M",
            color: "White",
            material: "100% Cotton",
            stock: 150
        }
    })
    information: JsonValue

    @Field(() => Int)
    @ApiProperty({
        description: "The price of the blank variance",
        example: 1500
    })
    blankPrice: number

    @Field(() => ProductEntity, { nullable: true })
    @ApiProperty({
        description: "The product this blank variance belongs to",
        type: () => ProductEntity
    })
    product?: ProductEntity

    constructor(partial: Partial<BlankVariancesEntity>) {
        Object.assign(this, partial)
    }
}
