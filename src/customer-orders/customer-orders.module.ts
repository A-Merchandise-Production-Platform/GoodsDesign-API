import { Module } from '@nestjs/common';
import { CustomerOrdersService } from './customer-orders.service';
import { CustomerOrdersResolver } from './customer-orders.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CustomerOrdersService, CustomerOrdersResolver],
  exports: [CustomerOrdersService],
})
export class CustomerOrdersModule {} 