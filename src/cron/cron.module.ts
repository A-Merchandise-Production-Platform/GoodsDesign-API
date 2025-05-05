import { AlgorithmModule } from '@/algorithm/algorithm.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentTransactionModule } from 'src/payment-transaction/payment-transaction.module';
import { PrismaModule } from 'src/prisma';
import { CronService } from './cron.service';
import { FactoryModule } from '@/factory/factory.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, PaymentTransactionModule, AlgorithmModule, NotificationsModule, FactoryModule],
  providers: [CronService],
})
export class CronModule {}