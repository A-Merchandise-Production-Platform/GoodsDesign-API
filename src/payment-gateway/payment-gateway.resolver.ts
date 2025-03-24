import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { PaymentGateway, PaymentGatewayService } from './payment-gateway.service';
import { CurrentUser } from 'src/auth';
import { User } from '@prisma/client';

@Resolver()
@UseGuards(GraphqlJwtAuthGuard)
export class PaymentGatewayResolver {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Mutation(() => String)
  async createPayment(
    @Args('gateway') gateway: PaymentGateway,
    @Args('paymentId') paymentId: string,
    @CurrentUser() { id: userId }: User,
  ) {
    switch (gateway) {
      case PaymentGateway.PAYOS:
        return this.paymentGatewayService.createPayOSPayment({
          paymentId,
          userId,
        });
      case PaymentGateway.VNPAY:
        return this.paymentGatewayService.createVNPayPayment({
          paymentId,
          userId,
        });
      default:
        throw new Error('Unsupported payment gateway');
    }
  }

  // @Mutation(() => Boolean)
  // async verifyPayment(
  //   @Args('gateway') gateway: PaymentGateway,
  //   @Args('paymentData') paymentData: any,
  // ) {
  //   return this.paymentGatewayService.verifyPayment(gateway, paymentData);
  // }
} 