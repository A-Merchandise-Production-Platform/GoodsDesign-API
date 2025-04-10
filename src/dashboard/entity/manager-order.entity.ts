import { Field, ObjectType } from "@nestjs/graphql"

import { Int } from "@nestjs/graphql"

@ObjectType()
export class ManagerOrderDashboardEntity {
    @Field(() => Int)
    totalOrders: number

    @Field(() => Int)
    lastMonthOrders: number

    @Field(() => Int)
    pendingOrders: number

    @Field(() => Int)
    lastMonthPendingOrders: number

    @Field(() => Int)
    inProductionOrders: number

    @Field(() => Int)
    lastMonthInProductionOrders: number

    @Field(() => Int)
    completedOrders: number

    @Field(() => Int)
    lastMonthCompletedOrders: number

    constructor(partial: Partial<ManagerOrderDashboardEntity>) {
        Object.assign(this, partial)
    }
}
