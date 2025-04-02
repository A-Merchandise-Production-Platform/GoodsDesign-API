import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { OrderStatus, PaymentStatus, Prisma, TransactionStatus } from '@prisma/client';

@Injectable()
export class PaymentTransactionService {
  private logger = new Logger(PaymentTransactionService.name)
  constructor(private prisma: PrismaService) {}

  create(createPaymentTransactionDto: CreatePaymentTransactionDto) {
    return this.prisma.paymentTransaction.create({
      data: createPaymentTransactionDto as unknown as Prisma.PaymentTransactionCreateInput,
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  findAll() {
    return this.prisma.paymentTransaction.findMany({
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  update(id: string, updatePaymentTransactionDto: UpdatePaymentTransactionDto) {
    return this.prisma.paymentTransaction.update({
      where: { id },
      data: updatePaymentTransactionDto,
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.paymentTransaction.delete({
      where: { id },
    });
  }

  findByPaymentId(paymentId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { paymentId },
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  findByCustomerId(customerId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { customerId },
      include: {
        payment: true,
        customer: true,
      },
    });
  }

  public async checkPaymentTransactionIsNotCompleted(): Promise<void> {
    try {
      // Find all transactions that are in PENDING status and were created more than 15 minutes ago
      const pendingTransactions = await this.prisma.paymentTransaction.findMany({
        where: {
          status: TransactionStatus.PENDING,
          createdAt: {
            lt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
          }
        },
        include: {
          payment: true
        }
      });
  
      this.logger.log(`Found ${pendingTransactions.length} pending transactions to check`);
  
      for (const transaction of pendingTransactions) {
        try {
          // Get payment status from payment gateway
          const payment = await this.prisma.payment.findFirst({
            where: {
              id: transaction.payment.id
            }
          })
  
          if (payment.status === PaymentStatus.COMPLETED) {
            // Update transaction to completed
            await this.prisma.paymentTransaction.update({
              where: { id: transaction.id },
              data: {
                status: TransactionStatus.FAILED,
                transactionLog: `${transaction.transactionLog}\nAutomatically marked as FAILED by system check on ${new Date().toISOString()}`
              }
            });
  
            // // Update order's deposit paid amount
            // if (transaction.payment.orderId) {
            //   await this.prisma.customerOrder.update({
            //     where: { id: transaction.payment.orderId },
            //     data: {
            //       status: OrderStatus.PAYMENT_RECEIVED,
            //       depositPaid: {
            //         increment: transaction.amount
            //       },
            //       history: {
            //         create: {
            //           status: OrderStatus.PAYMENT_RECEIVED,
            //           timestamp: new Date(),
            //           note: `Payment of ${transaction.amount} received for transaction ${transaction.id}`
            //         }
            //       }
            //     }
            //   });
            // }
  
            this.logger.log(`Transaction ${transaction.id} marked as completed`);
          } else {
            // Still pending, but update the log
            await this.prisma.paymentTransaction.update({
              where: { id: transaction.id },
              data: {
                status: TransactionStatus.FAILED,
                transactionLog: `${transaction.transactionLog}\nStatus check performed on ${new Date().toISOString()} - still pending(15mins) so changed it failed`
              }
            });
          }
        } catch (transactionError) {
          this.logger.error(`Error processing transaction ${transaction.id}: ${transactionError.message}`);
          
          // Log the error but continue with other transactions
          await this.prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              transactionLog: `${transaction.transactionLog}\nError during status check: ${transactionError.message} on ${new Date().toISOString()}`
            }
          });
        }
      }
  
      // Handle transactions that are older than 24 hours and still pending
      const staleTransactions = await this.prisma.paymentTransaction.findMany({
        where: {
          status: TransactionStatus.PENDING,
          createdAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
          }
        }
      });
  
      this.logger.log(`Found ${staleTransactions.length} stale transactions to mark as failed`);
  
      // Mark all stale transactions as failed
      if (staleTransactions.length > 0) {
        await this.prisma.paymentTransaction.updateMany({
          where: {
            id: {
              in: staleTransactions.map(t => t.id)
            }
          },
          data: {
            status: TransactionStatus.FAILED,
            transactionLog: `Auto-marked as failed due to timeout after 24 hours on ${new Date().toISOString()}`
          }
        });
      }
  
      this.logger.log('Payment transaction status check completed successfully');
    } catch (error) {
      this.logger.error(`Error in checkPaymentTransactionIsNotCompleted: ${error.message}`);
      throw error;
    }
  }
} 