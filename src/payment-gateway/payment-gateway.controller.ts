import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentGatewayService, VNPayQueryParams } from './payment-gateway.service';
import { WebhookType } from '@payos/node/lib/type';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get('ipn-vnpay')
  async handleVNPayIPN(@Query() query: VNPayQueryParams) {
    return this.paymentGatewayService.verifyVNPayPayment(query);
  }

  @Post('ipn-payos')
  async handlePayOSIPN(@Body() webhook: WebhookType) {
    return this.paymentGatewayService.verifyPayOSPayment(webhook);
  }
}
