import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { PaymentGateway, PaymentGatewayService } from './payment-gateway.service';

@Resolver()
@UseGuards(GraphqlJwtAuthGuard)
export class PaymentGatewayResolver {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Mutation(() => String)
  async createPayment(
    @Args('gateway') gateway: PaymentGateway,
    @Args('amount') amount: number,
    @Args('orderId') orderId: string,
    @Args('description') description: string,
    @Args('returnUrl') returnUrl: string,
    @Context() context: any,
  ) {
    switch (gateway) {
      case PaymentGateway.PAYOS:
        return this.paymentGatewayService.createPayOSPayment({
          amount,
          orderId,
          description,
          returnUrl,
        });
      case PaymentGateway.VNPAY:
        return this.paymentGatewayService.createVNPayPayment({
          amount,
          orderId,
          description,
          returnUrl,
        });
      default:
        throw new Error('Unsupported payment gateway');
    }
  }

  @Mutation(() => Boolean)
  async verifyPayment(
    @Args('gateway') gateway: PaymentGateway,
    @Args('paymentData') paymentData: any,
  ) {
    return this.paymentGatewayService.verifyPayment(gateway, paymentData);
  }
} 