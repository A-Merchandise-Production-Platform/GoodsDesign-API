import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { QualityCheckStatus } from '@prisma/client';

@InputType()
export class CreateCheckQualityDto {
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

  @Field(() => QualityCheckStatus)
  status: QualityCheckStatus;

  @Field(() => Boolean)
  reworkRequired: boolean;

  @Field(() => ID, { nullable: true })
  factoryOrderDetailId?: string;

  @Field(() => String, { nullable: true })
  note?: string;
} 