import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentTransactionDto } from './create-payment-transaction.dto';

export class UpdatePaymentTransactionDto extends PartialType(CreatePaymentTransactionDto) {} 