import { Field, ID, ObjectType } from "@nestjs/graphql"
import { UserEntity } from "src/users"

@ObjectType()
export class NotificationEntity {
    @Field(() => ID)
    id: string

    @Field({ nullable: true })
    title?: string

    @Field({ nullable: true })
    content?: string

    @Field({ nullable: true })
    url?: string

    @Field(() => Boolean)
    isRead: boolean

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => UserEntity, { nullable: true })
    user: UserEntity

    constructor(partial: Partial<NotificationEntity>) {
        Object.assign(this, partial)
    }
}
