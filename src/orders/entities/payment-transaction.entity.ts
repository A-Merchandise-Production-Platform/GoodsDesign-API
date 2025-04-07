import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { PaymentEntity } from './payment.entity';
import { TransactionStatus } from '@prisma/client';

@ObjectType()
export class PaymentTransactionEntity {
    @Field(() => ID)
    id: string;

    @Field()
    paymentId: string;

    @Field(() => Int)
    amount: number;

    @Field(() => String)
    status: TransactionStatus;

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

    @Field(() => PaymentEntity, { nullable: true })
    payment?: PaymentEntity;

    constructor(partial: Partial<PaymentTransactionEntity>) {
        Object.assign(this, partial);
    }
} 