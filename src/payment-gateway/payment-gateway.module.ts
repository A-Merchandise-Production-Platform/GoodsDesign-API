import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayResolver } from './payment-gateway.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaymentGatewayController } from './payment-gateway.controller';
import { MailModule } from 'src/mail';
import { NotificationsModule } from 'src/notifications/notifications.module';
@Module({
  imports: [PrismaModule, MailModule, NotificationsModule],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService, PaymentGatewayResolver],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {} 