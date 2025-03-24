import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PaymentMethod, TransactionStatus, TransactionType } from '@prisma/client';

export class CreatePaymentTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  paymentId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  paymentGatewayTransactionId: string;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;

  @IsString()
  @IsNotEmpty()
  transactionLog: string;
} 