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

    @Field(() => String, { nullable: true })
    note?: string;

    @Field(() => String)
    status: PaymentStatus;

    @Field(() => String, { nullable: true })
    paidAt?: Date;

    @Field(() => String, { nullable: true })
    paidBy?: string;

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => UserEntity, { nullable: true })
    customer?: UserEntity;

    @Field(() => [PaymentTransactionEntity], { nullable: true })
    transactions?: PaymentTransactionEntity[];

    @Field(() => String, { nullable: true })
    createdAt?: Date;

    @Field(() => String, { nullable: true })
    updatedAt?: Date;

    constructor(partial: Partial<PaymentEntity>) {
        Object.assign(this, partial);
    }
} 