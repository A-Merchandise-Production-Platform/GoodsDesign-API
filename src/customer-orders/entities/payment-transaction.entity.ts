import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client"

@ObjectType()
export class PaymentTransactionEntity {
    @Field(() => ID)
    id: string

    @Field(() => String)
    paymentId: string

    @Field(() => String)
    customerId: string

    @Field(() => String)
    paymentGatewayTransactionId: string

    @Field(() => Int)
    amount: number

    @Field(() => String)
    type: TransactionType

    @Field(() => String)
    paymentMethod: PaymentMethod

    @Field(() => String)
    status: TransactionStatus

    @Field(() => String)
    transactionLog: string

    @Field(() => Date)
    createdAt: Date


    constructor(partial: Partial<PaymentTransactionEntity>) {
        Object.assign(this, partial)
    }
}