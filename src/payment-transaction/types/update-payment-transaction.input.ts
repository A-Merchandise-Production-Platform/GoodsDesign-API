import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePaymentTransactionInput } from './create-payment-transaction.input';

@InputType()
export class UpdatePaymentTransactionInput extends PartialType(CreatePaymentTransactionInput) {} 