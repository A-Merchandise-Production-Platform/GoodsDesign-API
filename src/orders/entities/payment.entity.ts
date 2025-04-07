import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { OrderEntity } from './order.entity';
import { PaymentTransactionEntity } from 'src/payment-transaction/entities/payment-transaction.entity';
import { UserEntity } from 'src/users';

registerEnumType(PaymentStatus, {
    name: "PaymentStatus"
})

registerEnumType(PaymentType, {
    name: "PaymentType"
})

@ObjectType()
export class PaymentEntity {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field()
    customerId: string;

    @Field(() => Int)
    amount: number;

    @Field(() => String)
    type: PaymentType;

    @Field()
    paymentLog: string;

    @Field(() => String)
    status: PaymentStatus;


    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => UserEntity, { nullable: true })
    customer?: UserEntity;

    @Field(() => [PaymentTransactionEntity], { nullable: true })
    transactions?: PaymentTransactionEntity[];

    constructor(partial: Partial<PaymentEntity>) {
        Object.assign(this, partial);
    }
} 