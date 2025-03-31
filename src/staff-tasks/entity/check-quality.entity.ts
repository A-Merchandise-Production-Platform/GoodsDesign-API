import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { QualityCheckStatus } from '@prisma/client';
import { TaskEntity } from './task.entity';
import { CustomerOrderDetailEntity } from 'src/customer-orders/entities';
import { FactoryOrderDetailEntity } from 'src/factory-orders/entity/factory-order-detail.entity';

registerEnumType(QualityCheckStatus, {
  name: "QualityCheckStatus"
})

@ObjectType()
export class CheckQuality {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  taskId: string;

  @Field(() => ID)
  orderDetailId: string;

  @Field(() => ID, { nullable: true })
  factoryOrderDetailId?: string;

  @Field(() => Int)
  totalChecked: number;

  @Field(() => Int)
  passedQuantity: number;

  @Field(() => Int)
  failedQuantity: number;

  @Field(() => QualityCheckStatus)
  status: QualityCheckStatus;

  @Field(() => Boolean)
  reworkRequired: boolean;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Date)
  checkedAt: Date;

  @Field(() => String, { nullable: true })
  checkedBy?: string;

  @Field(() => CustomerOrderDetailEntity)
  orderDetail: CustomerOrderDetailEntity;

  @Field(() => FactoryOrderDetailEntity, { nullable: true })
  factoryOrderDetail?: FactoryOrderDetailEntity;
} 