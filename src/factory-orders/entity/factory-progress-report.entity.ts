import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FactoryOrder } from './factory-order.entity';

@ObjectType()
export class FactoryProgressReport {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  factoryOrderId: string;

  @Field(() => Int)
  completedQty: number;

  @Field(() => Date)
  reportDate: Date;

  @Field(() => Date)
  estimatedCompletion: Date;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => [String])
  photoUrls: string[];

  @Field(() => FactoryOrder, { nullable: true })
  factoryOrder?: FactoryOrder;

  constructor(partial: Partial<FactoryProgressReport>) {
    Object.assign(this, partial);
  }
} 