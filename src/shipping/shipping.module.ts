import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { RedisModule } from '../redis/redis.module';
import { ShippingResolver } from './shipping.resolver';
import { ShippingService } from './shipping.service';
import { AlgorithmModule } from '@/algorithm/algorithm.module';

@Module({
  imports: [
    HttpModule,
    RedisModule,
    PrismaModule,
    AlgorithmModule
  ],
  providers: [ShippingService, ShippingResolver],
  exports: [ShippingService]
})
export class ShippingModule {} 