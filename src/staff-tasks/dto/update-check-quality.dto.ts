import { Field, InputType, Int } from '@nestjs/graphql';
import { QualityCheckStatus } from '@prisma/client';

@InputType()
export class UpdateCheckQualityDto {

  @Field(() => Int, { nullable: true })
  passedQuantity?: number;

  @Field(() => Int, { nullable: true })
  failedQuantity?: number;

  @Field(() => QualityCheckStatus, { nullable: true })
  status?: QualityCheckStatus;

  @Field(() => Boolean, { nullable: true })
  reworkRequired?: boolean;

  @Field(() => String, { nullable: true })
  note?: string;
} 