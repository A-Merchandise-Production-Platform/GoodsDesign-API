import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethod, TransactionStatus, TransactionType } from '@prisma/client';
import { UserEntity } from 'src/users';

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Type of transaction',
})

registerEnumType(PaymentMethod, {
  name: 'PaymentMethod',
  description: 'Method of payment',
})

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
  description: 'Status of transaction',
})


@ObjectType()
export class PaymentTransactionEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  customerId: string;

  @Field()
  paymentGatewayTransactionId: string;

  @Field()
  amount: number;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Field()
  transactionLog: string;

  @Field()
  createdAt: Date;

  @Field(() => UserEntity, { nullable: true })
  customer?: UserEntity;
} 