import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { FactoryOrderStatus } from '@prisma/client';
import { FactoryOrder } from './entity/factory-order.entity';

@Injectable()
export class FactoryOrderService {
  private logger = new Logger(FactoryOrderService.name);

  constructor(private prisma: PrismaService) {}

  private getIncludeObject() {
    return {
      customerOrder: {
        include: {
          orderDetails: {
            include: {
              design: {
                include: {
                  designPositions: true,
                  user: true,
                  systemConfigVariant: true
                }
              }
            }
          }
        }
      },
      orderDetails: {
        include: {
          design: {
            include: {
              user: true,
              systemConfigVariant: true
            }
          },
          orderDetail: true,
          checkQualities: {
            include: {
              orderDetail: {
                include: {
                  order: true,
                  design: {
                    include: {
                      user: true,
                      systemConfigVariant: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      progressReports: true,
      qualityIssues: true,
      tasks: {
        include: {
          checkQualities: {
            include: {
              orderDetail: {
                include: {
                  order: true,
                  design: {
                    include: {
                      user: true,
                      systemConfigVariant: true
                    }
                  }
                }
              },
              factoryOrderDetail: {
                include: {
                  factoryOrder: true,
                  design: {
                    include: {
                      user: true,
                      systemConfigVariant: true
                    }
                  },
                  orderDetail: true
                }
              }
            }
          }
        }
      }
    };
  }

  async findAll(): Promise<FactoryOrder[]> {
    const data = await this.prisma.factoryOrder.findMany({
      include: this.getIncludeObject()
    });
    return data.map(item => new FactoryOrder(item));
  }

  async findOne(id: string): Promise<FactoryOrder> {
    const data = await this.prisma.factoryOrder.findUnique({
      where: { id },
      include: this.getIncludeObject()
    });
    return new FactoryOrder(data);
  }

  async findByFactory(factoryId: string): Promise<FactoryOrder[]> {
    if(!factoryId){
        throw new NotFoundException("factory id not found or u are not login")
    }
    const data = await this.prisma.factoryOrder.findMany({
      where: { factoryId },
      include: this.getIncludeObject()
    });
    return data.map(item => new FactoryOrder(item));
  }

  async findByCustomerOrder(customerOrderId: string): Promise<FactoryOrder[]> {
    const data = await this.prisma.factoryOrder.findMany({
      where: { customerOrderId },
      include: this.getIncludeObject()
    });
    return data.map(item => new FactoryOrder(item));
  }

  async updateStatus(id: string, status: FactoryOrderStatus): Promise<FactoryOrder> {
    const data = await this.prisma.factoryOrder.update({
      where: { id },
      data: { 
        status,
        lastUpdated: new Date()
      },
      include: this.getIncludeObject()
    });
    return new FactoryOrder(data);
  }

  async markAsDelayed(id: string): Promise<FactoryOrder> {
    const data = await this.prisma.factoryOrder.update({
      where: { id },
      data: { 
        isDelayed: true,
        lastUpdated: new Date()
      },
      include: this.getIncludeObject()
    });
    return new FactoryOrder(data);
  }
}