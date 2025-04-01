import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { PaymentGatewayService, VNPayQueryParams } from './payment-gateway.service';
import { WebhookType } from '@payos/node/lib/type';

@Controller('payment-gateway')
export class PaymentGatewayController {
  private logger = new Logger(PaymentGatewayController.name)
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get('ipn-vnpay')
  async handleVNPayIPN(@Query() query: VNPayQueryParams) {
    return this.paymentGatewayService.verifyVNPayPayment(query);
  }

  @Post('ipn-payos')
  async handlePayOSIPN(@Body() webhook: WebhookType) {
    this.logger.verbose(webhook)
    return {
      message: "Success"
    }
    return this.paymentGatewayService.verifyPayOSPayment(webhook);
  }

  @Get('ipn-payos')
  async handleGetPayOSIPN(@Body() webhook: WebhookType) {
    this.logger.verbose(webhook)
    return {
        message: "Success"
    }
  }
}
