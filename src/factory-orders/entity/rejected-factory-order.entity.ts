import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FactoryOrder } from './factory-order.entity';
import { FactoryEntity } from 'src/factory/entities/factory.entity';

@ObjectType()
export class RejectedFactoryOrder {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  factoryOrderId: string;

  @Field(() => String)
  factoryId: string;

  @Field(() => String)
  reason: string;

  @Field(() => Date)
  rejectedAt: Date;

  @Field(() => String, { nullable: true })
  reassignedTo?: string;

  @Field(() => Date, { nullable: true })
  reassignedAt?: Date;

  @Field(() => FactoryOrder, { nullable: true })
  factoryOrder?: FactoryOrder;

  @Field(() => FactoryEntity, { nullable: true })
  factory?: FactoryEntity;

  constructor(partial: Partial<RejectedFactoryOrder>) {
    Object.assign(this, partial);
  }
} 