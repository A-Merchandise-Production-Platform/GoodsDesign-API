import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CheckQuality } from './entity/check-quality.entity';
import { QualityCheckStatus } from '@prisma/client';

@Injectable()
export class CheckQualityService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CheckQuality[]> {
    return this.prisma.checkQuality.findMany({
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }

  async findOne(id: string): Promise<CheckQuality> {
    return this.prisma.checkQuality.findUnique({
      where: { id },
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }

  async findByTaskId(taskId: string): Promise<CheckQuality[]> {
    return this.prisma.checkQuality.findMany({
      where: { taskId },
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }

  async create(data: {
    taskId: string;
    orderDetailId: string;
    factoryOrderDetailId?: string;
    totalChecked: number;
    passedQuantity: number;
    failedQuantity: number;
    status: QualityCheckStatus;
    reworkRequired: boolean;
    note?: string;
    checkedBy?: string;
  }): Promise<CheckQuality> {
    return this.prisma.checkQuality.create({
      data: {
        ...data,
        checkedAt: new Date(),
      },
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }

  async updateStatus(id: string, status: QualityCheckStatus): Promise<CheckQuality> {
    return this.prisma.checkQuality.update({
      where: { id },
      data: { status },
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }

  async update(id: string, data: Partial<CheckQuality>): Promise<CheckQuality> {
    return this.prisma.checkQuality.update({
      where: { id },
      data,
      include: {
        task: true,
        orderDetail: true,
        factoryOrderDetail: true,
      },
    });
  }
} 