import { ObjectType, Field, ID, Int, registerEnumType } from "@nestjs/graphql"
import { OrderStatus } from "@prisma/client"
import { AddressEntity } from "src/addresses/entities/address.entity"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { UserEntity } from "src/users"
import { OrderDetailEntity } from "./order-detail.entity"
import { OrderProgressReportEntity } from "./order-progress-report.entity"
import { RejectedOrderEntity } from "./rejected-order.entity"
import { TaskEntity } from "../../tasks/entities/task.entity"
import { PaymentEntity } from "./payment.entity"

registerEnumType(OrderStatus, {
    name: "OrderStatus"
})

@ObjectType()
export class OrderEntity {
    @Field(() => ID)
    id: string

    @Field()
    customerId: string

    @Field(() => String, { nullable: true })
    factoryId?: string

    @Field(() => OrderStatus)
    status: OrderStatus

    @Field(() => Int)
    totalPrice: number

    @Field(() => Int)
    shippingPrice: number

    @Field()
    orderDate: Date

    @Field(() => Int)
    totalItems: number

    @Field(() => Date, { nullable: true })
    updatedAt?: Date

    @Field(() => Int, { nullable: true })
    totalProductionCost?: number

    @Field(() => Int, { nullable: true })
    currentProgress?: number

    @Field(() => String, { nullable: true })
    delayReason?: string

    @Field()
    isDelayed: boolean

    @Field(() => String, { nullable: true })
    orderCode?: string

    @Field(() => Int, { nullable: true })
    rating?: number

    @Field(() => String, { nullable: true })
    ratingComment?: string

    @Field(() => Date, { nullable: true })
    ratedAt?: Date

    @Field(() => String, { nullable: true })
    ratedBy?: string

    @Field(() => Date, { nullable: true })
    assignedAt?: Date

    @Field(() => Date, { nullable: true })
    acceptanceDeadline?: Date

    @Field(() => Date, { nullable: true })
    acceptedAt?: Date

    @Field(() => Date, { nullable: true })
    shippedAt?: Date

    @Field()
    estimatedShippingAt: Date

    @Field(() => Date, { nullable: true })
    doneProductionAt?: Date

    @Field()
    estimatedDoneProductionAt: Date

    @Field(() => Date, { nullable: true })
    doneCheckQualityAt?: Date

    @Field()
    estimatedCheckQualityAt: Date

    @Field(() => Date, { nullable: true })
    completedAt?: Date

    @Field()
    estimatedCompletionAt: Date

    @Field(() => String, { nullable: true })
    addressId?: string

    @Field(() => AddressEntity, { nullable: true })
    address?: AddressEntity

    @Field(() => UserEntity, { nullable: true })
    customer?: UserEntity

    @Field(() => FactoryEntity, { nullable: true })
    factory?: FactoryEntity

    @Field(() => [OrderDetailEntity], { nullable: true })
    orderDetails?: OrderDetailEntity[]

    @Field(() => [PaymentEntity], { nullable: true })
    payments?: PaymentEntity[]

    @Field(() => [OrderProgressReportEntity], { nullable: true })
    orderProgressReports?: OrderProgressReportEntity[]

    @Field(() => [TaskEntity], { nullable: true })
    tasks?: TaskEntity[]

    @Field(() => [RejectedOrderEntity], { nullable: true })
    rejectedHistory?: RejectedOrderEntity[]

    constructor(partial: Partial<OrderEntity>) {
        Object.assign(this, partial)
    }
}
