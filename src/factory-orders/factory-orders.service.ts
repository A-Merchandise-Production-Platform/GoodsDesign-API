import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { FactoryOrderStatus } from '@prisma/client';

@Injectable()
export class FactoryOrderService {
  private logger = new Logger(FactoryOrderService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.factoryOrder.findMany();
  }

  async findOne(id: string) {
    return this.prisma.factoryOrder.findUnique({
      where: { id },
      include: {
        customerOrder: {
            include: {
                orderDetails: {
                    include: {
                        design: {
                            include: {
                                designPositions: true
                            }
                        }
                    }
                }
            }
        }
      }
    });
  }

  async findByFactory(factoryId: string) {
    if(!factoryId){
        throw new NotFoundException("factory id not found or u are not login")
    }
    return this.prisma.factoryOrder.findMany({
      where: { factoryId },
      include: {
        customerOrder: {
            include: {
                orderDetails: {
                    include: {
                        design: {
                            include: {
                                designPositions: true
                            }
                        }
                    }
                }
            }
        }
      }
    });
  }

  async findByCustomerOrder(customerOrderId: string) {
    return this.prisma.factoryOrder.findMany({
      where: { customerOrderId }
    });
  }

  async updateStatus(id: string, status: FactoryOrderStatus) {
    console.log(id, status)
    return this.prisma.factoryOrder.update({
      where: { id },
      data: { 
        status,
      }
    });
  }

  async markAsDelayed(id: string) {
    return this.prisma.factoryOrder.update({
      where: { id },
      data: { isDelayed: true }
    });
  }
}