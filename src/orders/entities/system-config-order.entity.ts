import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { SystemConfigOrderType } from '@prisma/client';

@ObjectType()
export class SystemConfigOrderEntity {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    type: SystemConfigOrderType;

    @Field(() => Int)
    limitFactoryRejectOrders: number;

    @Field(() => Int)
    checkQualityTimesDays: number;

    @Field(() => Int)
    limitReworkTimes: number;

    @Field(() => Int)
    shippingDays: number;

    constructor(partial: Partial<SystemConfigOrderEntity>) {
        Object.assign(this, partial);
    }
} 