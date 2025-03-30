import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { CustomerOrderDetailEntity } from "./customer-order-detail.entity"
import { PaymentEntity } from "./payment.entity"
import { UserEntity } from "src/users"

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

    @Field(() => UserEntity, { nullable: true })
    customer?: UserEntity

    @Field(() => [CustomerOrderDetailEntity], { nullable: true })
    orderDetails?: CustomerOrderDetailEntity[]

    @Field(() => [PaymentEntity], { nullable: true })
    payments?: PaymentEntity[]

    constructor(partial: Partial<CustomerOrderEntity>) {
        Object.assign(this, partial)
    }
}
