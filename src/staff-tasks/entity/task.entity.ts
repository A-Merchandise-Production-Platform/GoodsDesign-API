import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CheckQualityEntity } from './check-quality.entity';

@ObjectType()
export class TaskEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  taskname: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  expiredTime: Date;

  @Field(() => String)
  qualityCheckStatus: string;

  @Field(() => [CheckQualityEntity])
  checkQualities: CheckQualityEntity[];
} 