import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma';
import { CronService } from './cron.service';
import { PaymentTransactionModule } from 'src/payment-transaction/payment-transaction.module';
import { FactoryModule } from 'src/factory/factory.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, PaymentTransactionModule, FactoryModule],
  providers: [CronService],
})
export class CronModule {}