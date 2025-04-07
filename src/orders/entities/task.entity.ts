import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskStatus, TaskType } from '@prisma/client';
import { OrderEntity } from './order.entity';
import { CheckQualityEntity } from './check-quality.entity';
import { UserEntity } from 'src/users';

@ObjectType()
export class TaskEntity {
    @Field(() => ID)
    id: string;

    @Field()
    taskname: string;

    @Field()
    description: string;

    @Field()
    startDate: Date;

    @Field()
    expiredTime: Date;

    @Field(() => String)
    taskType: TaskType;

    @Field(() => String, { nullable: true })
    orderId?: string;

    @Field(() => String, { nullable: true })
    userId?: string;

    @Field()
    assignedDate: Date;

    @Field(() => String)
    status: TaskStatus;

    @Field(() => Date, { nullable: true })
    completedDate?: Date;

    @Field(() => String, { nullable: true })
    note?: string;

    @Field(() => [CheckQualityEntity], { nullable: true })
    checkQualities?: CheckQualityEntity[];

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => UserEntity, { nullable: true })
    assignee?: UserEntity;

    constructor(partial: Partial<TaskEntity>) {
        Object.assign(this, partial);
    }
} 