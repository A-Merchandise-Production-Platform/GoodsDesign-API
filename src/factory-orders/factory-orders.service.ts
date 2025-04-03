import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FactoryOrderStatus, OrderStatus, OrderDetailStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarkAsDelayedDto } from './dto/mark-as-delayed.dto';
import { UpdateOrderDetailStatusDto } from './dto/update-order-detail-status.dto';
import { FactoryOrder } from './entity/factory-order.entity';

@Injectable()
export class FactoryOrderService {
  private logger = new Logger(FactoryOrderService.name);

  constructor(private readonly prisma: PrismaService) {}

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
              systemConfigVariant: true,
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
      include: {
        customerOrder: {
          include: {
            orderDetails: {
              include: {
                design: {
                  include: {
                    designPositions: {
                      include: {
                        positionType: true
                      }
                    },
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
                systemConfigVariant: true,
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
      }
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

  async markAsDelayed(id: string, dto: MarkAsDelayedDto): Promise<FactoryOrder> {
    try {
      const factoryOrder = await this.prisma.factoryOrder.update({
        where: { id },
        data: {
          isDelayed: true,
          delayReason: dto.delayReason,
          estimatedCompletionDate: dto.estimatedCompletionDate,
          lastUpdated: new Date(),
        },
        include: this.getIncludeObject()
      });

      // Create a progress report for the delay
      await this.prisma.factoryProgressReport.create({
        data: {
          factoryOrderId: id,
          completedQty: 0,
          estimatedCompletion: dto.estimatedCompletionDate,
          notes: `Order delayed: ${dto.delayReason}`,
          photoUrls: [],
        },
      });

      return new FactoryOrder(factoryOrder);
    } catch (error) {
      this.logger.error(`Error marking factory order as delayed: ${error.message}`);
      throw error;
    }
  }

  async markOnDoneProduction(id: string): Promise<FactoryOrder> {
    try {
      // First, check if all order details are completed
      const factoryOrder = await this.prisma.factoryOrder.findUnique({
        where: { id },
        include: {
          orderDetails: true
        }
      });

      if (!factoryOrder) {
        throw new NotFoundException('Factory order not found');
      }

      // Check if all order details are completed
      const allCompleted = factoryOrder.orderDetails.every(
        detail => detail.completedQty >= detail.quantity
      );

      if (!allCompleted) {
        throw new Error('Cannot mark as done production: Not all items are completed');
      }

      // Update factory order status
      const updatedOrder = await this.prisma.factoryOrder.update({
        where: { id },
        data: {
          status: FactoryOrderStatus.DONE_PRODUCTION,
          lastUpdated: new Date(),
        },
        include: this.getIncludeObject()
      });

      // Create a progress report for completion
      await this.prisma.factoryProgressReport.create({
        data: {
          factoryOrderId: id,
          completedQty: factoryOrder.orderDetails.reduce((sum, detail) => sum + detail.completedQty, 0),
          estimatedCompletion: new Date(),
          notes: 'Production completed successfully',
          photoUrls: [],
        },
      });

      // Update customer order status to reflect completion
      await this.prisma.customerOrder.update({
        where: { id: factoryOrder.customerOrderId },
        data: {
          status: OrderStatus.DONE_PRODUCTION,
          history: {
            create: {
              status: OrderStatus.DONE_PRODUCTION,
              timestamp: new Date(),
              note: 'Factory production completed'
            }
          }
        }
      });

      return new FactoryOrder(updatedOrder);
    } catch (error) {
      this.logger.error(`Error marking factory order as done production: ${error.message}`);
      throw error;
    }
  }

  async updateOrderDetailStatus(dto: UpdateOrderDetailStatusDto) {
    try {
      // Verify the order detail exists
      const orderDetail = await this.prisma.factoryOrderDetail.findUnique({
        where: { id: dto.orderDetailId },
        include: { factoryOrder: true },
      });

      if (!orderDetail) {
        throw new NotFoundException(`Order detail with ID ${dto.orderDetailId} not found`);
      }

      // Update the order detail status
      const updatedOrderDetail = await this.prisma.factoryOrderDetail.update({
        where: { id: dto.orderDetailId },
        data: { status: dto.status },
        include: { factoryOrder: true },
      });

      // Create a progress report
      await this.prisma.factoryProgressReport.create({
        data: {
          factoryOrderId: orderDetail.factoryOrderId,
          completedQty: 0,
          estimatedCompletion: new Date(),
          notes: dto.note,
          photoUrls: [],
        },
      });

      // Check if all details are completed
      const allDetails = await this.prisma.factoryOrderDetail.findMany({
        where: { factoryOrderId: orderDetail.factoryOrderId },
      });

      const allCompleted = allDetails.every(detail => detail.status === OrderDetailStatus.COMPLETED);

      if (allCompleted) {
        // Update the factory order status to DONE_PRODUCTION
        await this.prisma.factoryOrder.update({
          where: { id: orderDetail.factoryOrderId },
          data: { status: FactoryOrderStatus.DONE_PRODUCTION },
        });
      }

      return updatedOrderDetail;
    } catch (error) {
      this.logger.error(`Error updating order detail status: ${error.message}`, error.stack);
      throw error;
    }
  }
}