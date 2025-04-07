import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderEntity } from './order.entity';

@ObjectType()
export class OrderProgressReportEntity {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field()
    reportDate: Date;

    @Field(() => String, { nullable: true })
    note?: string;

    @Field(() => [String])
    imageUrls: string[];

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    constructor(partial: Partial<OrderProgressReportEntity>) {
        Object.assign(this, partial);
    }
} 