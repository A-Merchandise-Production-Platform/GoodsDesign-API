import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { QualityCheckStatus } from '@prisma/client';

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
} 