import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentTransactionService } from './payment-transaction.service';
import { PaymentTransaction } from './types/payment-transaction.type';
import { CreatePaymentTransactionInput } from './types/create-payment-transaction.input';
import { UpdatePaymentTransactionInput } from './types/update-payment-transaction.input';

@Resolver(() => PaymentTransaction)
export class PaymentTransactionResolver {
  constructor(private readonly paymentTransactionService: PaymentTransactionService) {}

  @Mutation(() => PaymentTransaction)
  createPaymentTransaction(
    @Args('input') createPaymentTransactionInput: CreatePaymentTransactionInput,
  ) {
    return this.paymentTransactionService.create(createPaymentTransactionInput);
  }

  @Query(() => [PaymentTransaction])
  paymentTransactions() {
    return this.paymentTransactionService.findAll();
  }

  @Query(() => PaymentTransaction, { nullable: true })
  paymentTransaction(@Args('id', { type: () => ID }) id: string) {
    return this.paymentTransactionService.findOne(id);
  }

  @Mutation(() => PaymentTransaction)
  updatePaymentTransaction(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updatePaymentTransactionInput: UpdatePaymentTransactionInput,
  ) {
    return this.paymentTransactionService.update(id, updatePaymentTransactionInput);
  }

  @Mutation(() => PaymentTransaction)
  removePaymentTransaction(@Args('id', { type: () => ID }) id: string) {
    return this.paymentTransactionService.remove(id);
  }

  @Query(() => [PaymentTransaction])
  paymentTransactionsByPayment(@Args('paymentId', { type: () => ID }) paymentId: string) {
    return this.paymentTransactionService.findByPaymentId(paymentId);
  }

  @Query(() => [PaymentTransaction])
  paymentTransactionsByCustomer(@Args('customerId', { type: () => ID }) customerId: string) {
    return this.paymentTransactionService.findByCustomerId(customerId);
  }
} 