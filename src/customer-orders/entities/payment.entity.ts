import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PaymentStatus, PaymentType } from "@prisma/client"
import { CustomerOrderEntity } from "./customer-order.entity"
import { PaymentTransactionEntity } from "./payment-transaction.entity"

@ObjectType()
export class PaymentEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    orderId: string

    @Field(() => String)
    customerId: string

    @Field(() => Int)
    amount: number

    @Field(() => String)
    type: PaymentType

    @Field(() => String)
    paymentLog: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => String)
    status: PaymentStatus

    // Relations
    @Field(() => CustomerOrderEntity, { nullable: true })
    order?: CustomerOrderEntity

    @Field(() => [PaymentTransactionEntity], { nullable: true })
    transactions?: PaymentTransactionEntity[]

    constructor(partial: Partial<PaymentEntity>) {
        Object.assign(this, partial)
    }
}