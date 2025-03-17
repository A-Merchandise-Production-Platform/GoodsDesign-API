import { Field, InputType, Int } from '@nestjs/graphql';
import { OrderStatus, QualityCheckStatus, ReworkStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateCustomerOrderDetailInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field(() => String, { defaultValue: OrderStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => String, { defaultValue: QualityCheckStatus.PENDING })
  @IsOptional()
  @IsEnum(QualityCheckStatus)
  qualityCheckStatus?: QualityCheckStatus;

  @Field(() => String, { defaultValue: ReworkStatus.NOT_REQUIRED })
  @IsOptional()
  @IsEnum(ReworkStatus)
  reworkStatus?: ReworkStatus;
}

@InputType()
export class CreateCustomerOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  shippingPrice: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  depositPaid: number;

  @Field(() => [CreateCustomerOrderDetailInput])
  @IsNotEmpty()
  orderDetails: CreateCustomerOrderDetailInput[];
}

@InputType()
export class UpdateCustomerOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  shippingPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  depositPaid?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  notes?: string;
}

@InputType()
export class CustomerOrderFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endDate?: Date;
} 