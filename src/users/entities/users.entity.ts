import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Roles } from "@prisma/client"
import { FactoryEntity } from "src/factory/entities/factory.entity"

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    id: string

    @Field(() => String, { nullable: true })
    name?: string

    @Field(() => String, { nullable: true })
    email?: string

    @Field(() => String, { nullable: true })
    phoneNumber?: string

    @Field(() => String, { nullable: true })
    imageUrl?: string

    @Field(() => Date, { nullable: true })
    dateOfBirth?: Date

    @Field(() => Boolean)
    gender: boolean

    @Field(() => Roles)
    role: Roles

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

    @Field(() => FactoryEntity, { nullable: true })
    factory?: FactoryEntity

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
}
