import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerOrderInput, UpdateCustomerOrderInput, CustomerOrderFilterInput } from './dto/customer-order.input';
import { OrderStatus, QualityCheckStatus, ReworkStatus } from '@prisma/client';

@Injectable()
export class CustomerOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateCustomerOrderInput) {
    const totalPrice = input.orderDetails.reduce(
      (sum, detail) => sum + detail.price * detail.quantity,
      0
    );

    return this.prisma.customerOrder.create({
      data: {
        customerId: input.customerId,
        status: OrderStatus.PENDING,
        totalPrice,
        shippingPrice: input.shippingPrice,
        depositPaid: input.depositPaid,
        orderDate: new Date(),
        orderDetails: {
          create: input.orderDetails.map(detail => ({
            designId: detail.productId,
            productId: detail.productId,
            quantity: detail.quantity,
            price: detail.price,
            status: OrderStatus.PENDING,
            qualityCheckStatus: QualityCheckStatus.PENDING,
            reworkStatus: ReworkStatus.NOT_REQUIRED,
          })),
        },
        history: {
          create: {
            status: OrderStatus.PENDING,
            timestamp: new Date(),
          },
        },
      },
      include: {
        customer: true,
        orderDetails: true,
        payments: true,
        transactions: true,
        history: true,
      },
    });
  }

  async findAll(filter?: CustomerOrderFilterInput) {
    const where: any = {};

    if (filter?.customerId) {
      where.customerId = filter.customerId;
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.startDate || filter?.endDate) {
      where.orderDate = {};
      if (filter.startDate) {
        where.orderDate.gte = filter.startDate;
      }
      if (filter.endDate) {
        where.orderDate.lte = filter.endDate;
      }
    }

    return this.prisma.customerOrder.findMany({
      where,
      include: {
        customer: true,
        orderDetails: true,
        payments: true,
        transactions: true,
        history: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.customerOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        orderDetails: true,
        payments: true,
        transactions: true,
        history: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(input: UpdateCustomerOrderInput) {
    const { id, ...updateData } = input;

    const order = await this.prisma.customerOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.customerOrder.update({
      where: { id },
      data: {
        ...updateData,
        history: {
          create: {
            status: updateData.status || order.status,
            timestamp: new Date(),
          },
        },
      },
      include: {
        customer: true,
        orderDetails: true,
        payments: true,
        transactions: true,
        history: true,
      },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.customerOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.customerOrder.delete({
      where: { id },
      include: {
        customer: true,
        orderDetails: true,
        payments: true,
        transactions: true,
        history: true,
      },
    });
  }
} 