import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
