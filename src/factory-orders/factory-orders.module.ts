import { Module } from '@nestjs/common';
import { FactoryOrderService } from './factory-orders.service';
import { FactoryOrderResolver } from './factory-orders.resolver';
import { PrismaService } from 'src/prisma';

@Module({
  providers: [FactoryOrderService, FactoryOrderResolver, PrismaService],
  exports: [FactoryOrderService]
})
export class FactoryOrderModule {}