import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentTransactionService } from './payment-transaction.service';
import { CreatePaymentTransactionInput } from './entities/create-payment-transaction.input';
import { UpdatePaymentTransactionInput } from './entities/update-payment-transaction.input';
import { PaymentTransactionEntity } from './entities/payment-transaction.entity';

@Resolver(() => PaymentTransactionEntity)
export class PaymentTransactionResolver {
  constructor(private readonly paymentTransactionService: PaymentTransactionService) {}

  @Mutation(() => PaymentTransactionEntity)
  createPaymentTransaction(
    @Args('input') createPaymentTransactionInput: CreatePaymentTransactionInput,
  ) {
    return this.paymentTransactionService.create(createPaymentTransactionInput);
  }

  @Query(() => [PaymentTransactionEntity])
  paymentTransactions() {
    return this.paymentTransactionService.findAll();
  }

  @Query(() => PaymentTransactionEntity, { nullable: true })
  paymentTransaction(@Args('id', { type: () => ID }) id: string) {
    return this.paymentTransactionService.findOne(id);
  }

  @Mutation(() => PaymentTransactionEntity)
  updatePaymentTransaction(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updatePaymentTransactionInput: UpdatePaymentTransactionInput,
  ) {
    return this.paymentTransactionService.update(id, updatePaymentTransactionInput);
  }

  @Mutation(() => PaymentTransactionEntity)
  removePaymentTransaction(@Args('id', { type: () => ID }) id: string) {
    return this.paymentTransactionService.remove(id);
  }

  @Query(() => [PaymentTransactionEntity])
  paymentTransactionsByPayment(@Args('paymentId', { type: () => ID }) paymentId: string) {
    return this.paymentTransactionService.findByPaymentId(paymentId);
  }

  @Query(() => [PaymentTransactionEntity])
  paymentTransactionsByCustomer(@Args('customerId', { type: () => ID }) customerId: string) {
    return this.paymentTransactionService.findByCustomerId(customerId);
  }
} 