import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { JsonValue } from "@prisma/client/runtime/library"
import GraphQLJSON from "graphql-type-json"
import { ProductEntity } from "src/products/entities/products.entity"

@ObjectType({ description: "Blank Variances" })
export class BlankVariancesEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    productId: string

    @Field(() => GraphQLJSON)
    information: JsonValue

    @Field(() => Int)
    blankPrice: number

    @Field(() => ProductEntity, { nullable: true })
    product?: ProductEntity

    constructor(partial: Partial<BlankVariancesEntity>) {
        Object.assign(this, partial)
    }
}
