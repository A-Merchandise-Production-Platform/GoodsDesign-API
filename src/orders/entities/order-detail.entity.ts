import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { OrderDetailStatus } from '@prisma/client';
import { OrderEntity } from './order.entity';
import { ProductDesignEntity } from 'src/product-design/entities/product-design.entity';
import { CheckQualityEntity } from './check-quality.entity';

@ObjectType()
export class OrderDetailEntity {
    @Field(() => ID)
    id: string;

    @Field()
    orderId: string;

    @Field()
    designId: string;

    @Field(() => Int)
    price: number;

    @Field(() => Int)
    quantity: number;

    @Field(() => String)
    status: OrderDetailStatus;

    @Field(() => Int)
    completedQty: number;

    @Field(() => Int)
    rejectedQty: number;

    @Field()
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt?: Date;

    @Field(() => Int, { nullable: true })
    productionCost?: number;

    @Field(() => Int)
    reworkTime: number;

    @Field()
    isRework: boolean;

    @Field(() => OrderEntity, { nullable: true })
    order?: OrderEntity;

    @Field(() => ProductDesignEntity, { nullable: true })
    design?: ProductDesignEntity;

    @Field(() => [CheckQualityEntity], { nullable: true })
    checkQualities?: CheckQualityEntity[];

    constructor(partial: Partial<OrderDetailEntity>) {
        Object.assign(this, partial);
    }
} 