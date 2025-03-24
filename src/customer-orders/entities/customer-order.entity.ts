import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { CustomerOrderDetailEntity } from "./customer-order-detail.entity"

@ObjectType()
export class CustomerOrderEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    customerId: string

    @Field(() => String)
    status: string

    @Field(() => Int)
    totalPrice: number

    @Field(() => Int)
    shippingPrice: number

    @Field(() => Int)
    depositPaid: number

    @Field(() => Date)
    orderDate: Date

    @Field(() => [CustomerOrderDetailEntity], { nullable: true })
    orderDetails?: CustomerOrderDetailEntity[]

    constructor(partial: Partial<CustomerOrderEntity>) {
        Object.assign(this, partial)
    }
}
