import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { UserEntity } from 'src/users/entities/users.entity';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Status of the customer order',
});

@ObjectType()
export class CustomerOrderDetail {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  customerOrderId: string;

  @Field(() => String)
  productId: string;

  @Field(() => Number)
  quantity: number;

  @Field(() => Number)
  price: number;
}

@ObjectType()
export class Payment {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  customerOrderId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Date)
  paymentDate: Date;
}

@ObjectType()
export class PaymentTransaction {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  customerOrderId: string;

  @Field(() => String)
  paymentId: string;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class OrderHistory {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  customerOrderId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Date)
  timestamp: Date;

  @Field(() => String, { nullable: true })
  notes?: string;
}

@ObjectType()
export class CustomerOrder {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  customerId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Number)
  totalPrice: number;

  @Field(() => Number)
  shippingPrice: number;

  @Field(() => Number)
  depositPaid: number;

  @Field(() => Date)
  orderDate: Date;

  @Field(() => UserEntity)
  customer: UserEntity;

  @Field(() => [CustomerOrderDetail])
  orderDetails: CustomerOrderDetail[];

  @Field(() => [Payment])
  payments: Payment[];

  @Field(() => [PaymentTransaction])
  transactions: PaymentTransaction[];

  @Field(() => [OrderHistory])
  history: OrderHistory[];
} 