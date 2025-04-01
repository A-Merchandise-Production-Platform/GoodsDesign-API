import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { FactoryOrderStatus } from '@prisma/client';

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

  async findAll() {
    return this.prisma.factoryOrder.findMany({
      include: this.getIncludeObject()
    });
  }

  async findOne(id: string) {
    return this.prisma.factoryOrder.findUnique({
      where: { id },
      include: this.getIncludeObject()
    });
  }

  async findByFactory(factoryId: string) {
    if(!factoryId){
        throw new NotFoundException("factory id not found or u are not login")
    }
    return this.prisma.factoryOrder.findMany({
      where: { factoryId },
      include: this.getIncludeObject()
    });
  }

  async findByCustomerOrder(customerOrderId: string) {
    return this.prisma.factoryOrder.findMany({
      where: { customerOrderId },
      include: this.getIncludeObject()
    });
  }

  async updateStatus(id: string, status: FactoryOrderStatus) {
    return this.prisma.factoryOrder.update({
      where: { id },
      data: { 
        status,
        lastUpdated: new Date()
      },
      include: this.getIncludeObject()
    });
  }

  async markAsDelayed(id: string) {
    return this.prisma.factoryOrder.update({
      where: { id },
      data: { 
        isDelayed: true,
        lastUpdated: new Date()
      },
      include: this.getIncludeObject()
    });
  }
}