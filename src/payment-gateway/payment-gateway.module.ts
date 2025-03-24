import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayResolver } from './payment-gateway.resolver';

@Module({
  providers: [PaymentGatewayService, PaymentGatewayResolver],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {} 