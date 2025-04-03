import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { CheckQuality } from "./check-quality.entity"
import { QualityCheckStatus } from "@prisma/client"
import { StaffTask } from "./staff-task.entity"

registerEnumType(QualityCheckStatus, {
    name: "QualityCheckStatus"
})

@ObjectType()
export class TaskEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    description: string

    @Field(() => String)
    taskname: string

    @Field(() => String)
    status: string

    @Field(() => Date)
    startDate: Date

    @Field(() => Date)
    expiredTime: Date

    @Field(() => QualityCheckStatus)
    qualityCheckStatus: QualityCheckStatus

    @Field(() => String, { nullable: true })
    taskType?: string

    @Field(() => ID, { nullable: true })
    factoryOrderId?: string

    @Field(() => String, { nullable: true })
    assignedBy?: string

    @Field(() => [CheckQuality])
    checkQualities: CheckQuality[]

    @Field(() => [StaffTask], { nullable: true })
    staffTasks?: StaffTask[]

    constructor(partial: Partial<TaskEntity>) {
        Object.assign(this, partial)
    }
}
