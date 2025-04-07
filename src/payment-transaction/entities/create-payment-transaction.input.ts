import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaymentMethod, TransactionStatus, TransactionType } from '@prisma/client';

@InputType()
export class CreatePaymentTransactionInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  paymentId: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  paymentGatewayTransactionId: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  amount: number;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @Field(() => PaymentMethod)
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @Field(() => TransactionStatus)
  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  transactionLog: string;
} 