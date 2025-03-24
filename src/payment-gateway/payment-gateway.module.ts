import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayResolver } from './payment-gateway.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentGatewayService, PaymentGatewayResolver],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {} 