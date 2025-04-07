import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderEntity } from './order.entity';
import { FactoryEntity } from 'src/factory/entities/factory.entity';

@ObjectType()
export class RejectedOrderEntity {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field()
    factoryId: string;

    @Field()
    reason: string;

    @Field()
    rejectedAt: Date;

    @Field(() => String, { nullable: true })
    reassignedTo?: string;

    @Field(() => Date, { nullable: true })
    reassignedAt?: Date;

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => FactoryEntity, { nullable: true })
    factory?: FactoryEntity;

    constructor(partial: Partial<RejectedOrderEntity>) {
        Object.assign(this, partial);
    }
} 