import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { CustomerOrderDetailEntity } from 'src/customer-orders/entities';

@ObjectType()
export class CheckQualityEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  taskId: string;

  @Field(() => ID)
  orderDetailId: string;

  @Field(() => Int)
  totalChecked: number;

  @Field(() => Int)
  passedQuantity: number;

  @Field(() => Int)
  failedQuantity: number;

  @Field(() => String)
  status: string;

  @Field(() => Boolean)
  reworkRequired: boolean;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Date)
  checkedAt: Date;
} 