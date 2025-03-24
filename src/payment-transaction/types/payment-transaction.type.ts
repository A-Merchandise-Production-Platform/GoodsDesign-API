import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaymentMethod, TransactionStatus, TransactionType } from '@prisma/client';
import { UserEntity } from 'src/users';

@ObjectType()
export class PaymentTransaction {
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