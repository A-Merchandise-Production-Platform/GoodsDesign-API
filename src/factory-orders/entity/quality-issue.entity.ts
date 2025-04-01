import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { QualityIssueStatus } from '@prisma/client';
import { FactoryOrder } from './factory-order.entity';

registerEnumType(QualityIssueStatus, {
  name: "QualityIssueStatus"
})

@ObjectType()
export class QualityIssue {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  factoryOrderId: string;

  @Field(() => Date)
  reportedAt: Date;

  @Field(() => String, { nullable: true })
  reportedBy?: string;

  @Field(() => String, { nullable: true })
  assignedTo?: string;

  @Field(() => String)
  issueType: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  photoUrls: string[];

  @Field(() => QualityIssueStatus)
  status: QualityIssueStatus;

  @Field(() => String, { nullable: true })
  resolution?: string;

  @Field(() => Date, { nullable: true })
  resolvedAt?: Date;

  @Field(() => String, { nullable: true })
  resolvedBy?: string;

  @Field(() => FactoryOrder, { nullable: true })
  factoryOrder?: FactoryOrder;
} 