import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateOrderDetailInput } from './create-order-detail.input';

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderDetailInput])
  @IsNotEmpty()
  orderDetails: CreateOrderDetailInput[]
}
