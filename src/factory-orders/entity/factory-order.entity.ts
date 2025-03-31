import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FactoryOrderStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { CustomerOrderEntity } from 'src/customer-orders/entities';

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

  @Field(() => Date, { nullable: true })
  acceptanceDeadline?: Date;

  @Field(() => Date, { nullable: true })
  estimatedCompletionDate?: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Boolean, { defaultValue: false })
  isDelayed: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => CustomerOrderEntity, {nullable:true})
  @IsOptional()
  customerOrder?: CustomerOrderEntity
}