import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"

@ObjectType()
export class CategoryEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    name: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => String, { nullable: true })
    imageUrl?: string

    @Field(() => Boolean)
    isActive: boolean

    @Field(() => Boolean)
    isDeleted: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => String, { nullable: true })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => String, { nullable: true })
    updatedBy?: string

    @Field(() => Date, { nullable: true })
    deletedAt?: Date

    @Field(() => String, { nullable: true })
    deletedBy?: string

    @Field(() => Int, { nullable: true })
    totalProducts?: number

    constructor(partial: Partial<CategoryEntity>) {
        Object.assign(this, partial)
    }
}
