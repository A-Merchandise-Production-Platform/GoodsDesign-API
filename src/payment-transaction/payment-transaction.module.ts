import { Module } from '@nestjs/common';
import { PaymentTransactionService } from './payment-transaction.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentTransactionResolver } from './payment-transaction.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PaymentTransactionService, PaymentTransactionResolver],
  exports: [PaymentTransactionService],
})
export class PaymentTransactionModule {} 