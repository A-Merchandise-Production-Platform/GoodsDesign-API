import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ShippingResolver } from './shipping.resolver';
import { ShippingService } from './shipping.service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [
    HttpModule,
    RedisModule,
    PrismaModule
  ],
  providers: [ShippingService, ShippingResolver],
  exports: [ShippingService]
})
export class ShippingModule {} 