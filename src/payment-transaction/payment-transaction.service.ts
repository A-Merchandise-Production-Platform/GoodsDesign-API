import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentTransactionService {
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
} 