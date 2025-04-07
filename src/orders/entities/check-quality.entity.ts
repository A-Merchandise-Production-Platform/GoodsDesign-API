import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { QualityCheckStatus } from '@prisma/client';
import { TaskEntity } from './task.entity';
import { OrderDetailEntity } from './order-detail.entity';

registerEnumType(QualityCheckStatus, {
    name: "QualityCheckStatus"
})

@ObjectType()
export class CheckQualityEntity {
    @Field(() => ID)
    id: string;

    @Field()
    taskId: string;

    @Field()
    orderDetailId: string;

    @Field(() => Int)
    totalChecked: number;

    @Field(() => Int)
    passedQuantity: number;

    @Field(() => Int)
    failedQuantity: number;

    @Field(() => String)
    status: QualityCheckStatus;

    @Field(() => String, { nullable: true })
    note?: string;

    @Field()
    createdAt: Date;

    @Field()
    checkedAt: Date;

    @Field(() => String, { nullable: true })
    checkedBy?: string;

    @Field(() => [String])
    imageUrls: string[];

    @Field(() => TaskEntity, { nullable: true })
    task?: TaskEntity;

    @Field(() => OrderDetailEntity, { nullable: true })
    orderDetail?: OrderDetailEntity;

    constructor(partial: Partial<CheckQualityEntity>) {
        Object.assign(this, partial);
    }
} 