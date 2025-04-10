import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { PrismaModule } from 'src/prisma';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ShippingModule } from 'src/shipping/shipping.module';

@Module({
  imports: [PrismaModule, NotificationsModule, ShippingModule],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
