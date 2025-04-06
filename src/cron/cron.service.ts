import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentTransactionService } from 'src/payment-transaction/payment-transaction.service';
import { PrismaService } from 'src/prisma';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name)

  constructor(private prisma: PrismaService,
    private paymentTransactionService: PaymentTransactionService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: "checkPaymentTransactionIsNotCompleted"
  })
  async checkPaymentTransactionIsNotCompleted() {
    await this.paymentTransactionService.checkPaymentTransactionIsNotCompleted()
  }

}