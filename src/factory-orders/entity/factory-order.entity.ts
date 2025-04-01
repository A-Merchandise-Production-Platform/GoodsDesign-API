import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FactoryOrderStatus } from '@prisma/client';
import { CustomerOrderEntity } from 'src/customer-orders/entities';
import { TaskEntity } from 'src/staff-tasks/entity/task.entity';
import { FactoryOrderDetailEntity } from './factory-order-detail.entity';
import { FactoryProgressReport } from './factory-progress-report.entity';
import { QualityIssue } from './quality-issue.entity';

registerEnumType(FactoryOrderStatus, {
    name: "FactoryOrderStatus"
})

@ObjectType()
export class FactoryOrder {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  factoryId: string;

  @Field(() => String)
  customerOrderId: string;

  @Field(() => FactoryOrderStatus)
  status: FactoryOrderStatus;

  @Field(() => Date)
  assignedAt: Date;

  @Field(() => Date)
  acceptanceDeadline: Date;

  @Field(() => Date, { nullable: true })
  acceptedAt?: Date;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;

  @Field(() => Date, { nullable: true })
  estimatedCompletionDate?: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  shippedAt?: Date;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Int)
  totalProductionCost: number;

  @Field(() => Date, { nullable: true })
  lastUpdated?: Date;

  @Field(() => Int, { nullable: true })
  currentProgress?: number;

  @Field(() => String, { nullable: true })
  delayReason?: string;

  @Field(() => Boolean)
  isDelayed: boolean;

  @Field(() => CustomerOrderEntity, { nullable: true })
  customerOrder?: CustomerOrderEntity;

  @Field(() => [FactoryOrderDetailEntity], { nullable: true })
  orderDetails?: FactoryOrderDetailEntity[];

  @Field(() => [FactoryProgressReport], { nullable: true })
  progressReports?: FactoryProgressReport[];

  @Field(() => [QualityIssue], { nullable: true })
  qualityIssues?: QualityIssue[];

  @Field(() => [TaskEntity], { nullable: true })
  tasks?: TaskEntity[];

  constructor(partial: Partial<FactoryOrder>) {
    Object.assign(this, partial)
}
}