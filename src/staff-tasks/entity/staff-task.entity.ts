import { Field, ID, ObjectType } from "@nestjs/graphql"
import { UserEntity } from "src/users"
import { TaskEntity } from "./task.entity"

@ObjectType()
export class StaffTask {
    @Field(() => ID)
    id: string

    @Field(() => ID)
    userId: string

    @Field(() => ID)
    taskId: string

    @Field(() => Date)
    assignedDate: Date

    @Field(() => String, { nullable: true })
    note?: string

    @Field(() => String)
    status: string

    @Field(() => Date, { nullable: true })
    completedDate?: Date

    @Field(() => UserEntity)
    user: UserEntity

    @Field(() => TaskEntity)
    task: TaskEntity

    constructor(partial: Partial<StaffTask>) {
        Object.assign(this, partial)
    }
}
