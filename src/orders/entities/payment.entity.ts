import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { PaymentStatus } from '@prisma/client';
import { OrderEntity } from './order.entity';
import { PaymentTransactionEntity } from './payment-transaction.entity';

@ObjectType()
export class PaymentEntity {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field(() => Int)
    amount: number;

    @Field(() => String)
    status: PaymentStatus;

    @Field(() => String, { nullable: true })
    note?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    paidAt?: Date;

    @Field(() => String, { nullable: true })
    paidBy?: string;

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => [PaymentTransactionEntity], { nullable: true })
    transactions?: PaymentTransactionEntity[];

    constructor(partial: Partial<PaymentEntity>) {
        Object.assign(this, partial);
    }
} 