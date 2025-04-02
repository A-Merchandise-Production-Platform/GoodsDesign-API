import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OrderDetailStatus } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(OrderDetailStatus, {
  name: 'OrderDetailStatus',
  description: 'Status of a factory order detail item',
});

@InputType()
export class UpdateOrderDetailStatusDto {
  @Field(() => String, { description: 'The ID of the factory order detail to update' })
  @IsUUID()
  @IsNotEmpty()
  orderDetailId: string;

  @Field(() => OrderDetailStatus, { description: 'The new status to set for the order detail' })
  @IsEnum(OrderDetailStatus)
  @IsNotEmpty()
  status: OrderDetailStatus;

  @Field(() => String, { nullable: true, description: 'Optional note about the status change' })
  @IsString()
  note?: string;
} 