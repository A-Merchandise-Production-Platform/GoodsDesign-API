import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class CategorySearchEntity {
    @Field(() => String, { nullable: true })
    name?: string

    @Field(() => String, { nullable: true })
    description?: string

    @Field(() => Boolean, { nullable: true })
    isActive?: boolean

    @Field(() => Boolean, { nullable: true })
    isDeleted?: boolean

    @Field(() => Date, { nullable: true })
    createdAtStart?: Date

    @Field(() => Date, { nullable: true })
    createdAtEnd?: Date

    @Field(() => String, { nullable: true })
    createdBy?: string

    @Field(() => Date, { nullable: true })
    updatedAtStart?: Date

    @Field(() => Date, { nullable: true })
    updatedAtEnd?: Date

    @Field(() => String, { nullable: true })
    updatedBy?: string

    constructor(partial: Partial<CategorySearchEntity>) {
        Object.assign(this, partial)
    }
}
