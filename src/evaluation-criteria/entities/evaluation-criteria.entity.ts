import { ProductEntity } from "@/products/entities/products.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class EvaluationCriteriaEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    name: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => ID)
    productId: string

    @Field(() => ProductEntity, { nullable: true })
    product?: ProductEntity

    constructor(partial: Partial<EvaluationCriteriaEntity>) {
        Object.assign(this, partial)
    }
} 