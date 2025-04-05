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
      },
      rejectedHistory: true
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
        },
        rejectedHistory: true
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
    const factoryOrder = await this.prisma.factoryOrder.findUnique({
      where: { id },
      include: {
        factory: true,
        customerOrder: true
      }
    });

    if (!factoryOrder) {
      throw new NotFoundException(`Factory order with ID ${id} not found`);
    }

    // If the order is being rejected, create rejection history
    if (status === FactoryOrderStatus.REJECTED) {
      await this.prisma.rejectedFactoryOrder.create({
        data: {
          factoryOrderId: id,
          factoryId: factoryOrder.factoryId,
          reason: 'Rejected by factory',
          rejectedAt: new Date()
        }
      });

      // Create notification for the factory owner
      await this.prisma.notification.create({
        data: {
          userId: factoryOrder.factory.factoryOwnerId,
          title: "Order Rejected",
          content: `You have rejected order #${factoryOrder.customerOrderId}`,
          url: `/factory/orders/${id}`
        }
      });

      // Create notification for managers
      const managers = await this.prisma.user.findMany({
        where: { role: 'MANAGER' }
      });

      for (const manager of managers) {
        await this.prisma.notification.create({
          data: {
            userId: manager.id,
            title: "Factory Order Rejected",
            content: `Factory ${factoryOrder.factory.name} has rejected order #${factoryOrder.customerOrderId}`,
            url: `/manager/orders/${factoryOrder.customerOrderId}`
          }
        });
      }
    }else{
      await this.prisma.customerOrder.update({
        where: { id: factoryOrder.customerOrderId },
        data: { status: OrderStatus.IN_PRODUCTION }
      });
    }

    const updatedOrder = await this.prisma.factoryOrder.update({
      where: { id },
      data: { status },
      include: this.getIncludeObject()
    });

    return new FactoryOrder(updatedOrder);
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
          estimatedCompletion: new Date(),
          notes: dto.note,
          photoUrls: [],
        },
      });

      // Check if all details are completed
      const allDetails = await this.prisma.factoryOrderDetail.findMany({
        where: { factoryOrderId: orderDetail.factoryOrderId },
      });

      const allCompleted = allDetails.every(detail => detail.status === OrderDetailStatus.COMPLETED || detail.status === OrderDetailStatus.REWORK_REQUIRED);

      if (allCompleted) {
        const factoryOrder = await this.prisma.factoryOrder.findFirst({
          where: {
            id: orderDetail.factoryOrderId
          }
        })

        if(factoryOrder.status == FactoryOrderStatus.REWORK_REQUIRED){
           // Update the factory order status to REWORK_COMPLETED
          await this.prisma.factoryOrder.update({
            where: { id: orderDetail.factoryOrderId },
            data: { status: FactoryOrderStatus.REWORK_COMPLETED },
          });

          await this.prisma.factoryOrderDetail.updateMany({
            where: { 
              factoryOrderId: orderDetail.factoryOrderId,
              status: OrderDetailStatus.REWORK_REQUIRED 
            },
            data: { status: OrderDetailStatus.COMPLETED }
          });

        }

        if(factoryOrder.status == "IN_PRODUCTION"){
          // Update the factory order status to DONE_PRODUCTION
            await this.prisma.factoryOrder.update({
              where: { id: orderDetail.factoryOrderId },
              data: { status: FactoryOrderStatus.DONE_PRODUCTION },
            });
            await this.prisma.customerOrder.update({
              where: { id: orderDetail.factoryOrder.customerOrderId },
              data: { status: OrderStatus.DONE_PRODUCTION }
          })
        }else if(factoryOrder.status == "REWORK_REQUIRED"){
          // Update the factory order status to DONE_PRODUCTION
          await this.prisma.factoryOrder.update({
            where: { id: orderDetail.factoryOrderId },
            data: { status: FactoryOrderStatus.REWORK_COMPLETED },
          });
          await this.prisma.customerOrder.update({
            where: { id: orderDetail.factoryOrder.customerOrderId },
            data: { status: OrderStatus.DONE_PRODUCTION }
        })
        }
      }

      return updatedOrderDetail;
    } catch (error) {
      this.logger.error(`Error updating order detail status: ${error.message}`, error.stack);
      throw error;
    }
  }

  async assignFactoryToOrder(factoryOrderId: string, factoryId: string): Promise<FactoryOrder> {
    try {
      const factoryOrder = await this.prisma.factoryOrder.findUnique({
        where: { id: factoryOrderId },
        include: { customerOrder: true }
      });

      if (!factoryOrder) {
        throw new NotFoundException(`Factory order with ID ${factoryOrderId} not found`);
      }

      // Verify the factory exists
      const factory = await this.prisma.factory.findUnique({
        where: { factoryOwnerId: factoryId }
      });

      if (!factory) {
        throw new NotFoundException(`Factory with ID ${factoryId} not found`);
      }

      // Update the factory order with the new factory and change status
      const updatedOrder = await this.prisma.factoryOrder.update({
        where: { id: factoryOrderId },
        data: {
          factoryId: factoryId,
          status: FactoryOrderStatus.WAITING_FOR_MANAGER_ASSIGN_STAFF,
          updatedAt: new Date()
        },
        include: this.getIncludeObject()
      });

      // Create notification for the factory owner
      await this.prisma.notification.create({
        data: {
          userId: factoryId,
          title: "New Order Assigned",
          content: `You have been assigned a new order #${factoryOrder.customerOrderId}`,
          url: `/factory/orders/${factoryOrderId}`
        }
      });

      return new FactoryOrder(updatedOrder);
    } catch (error) {
      this.logger.error(`Error assigning factory to order: ${error.message}`);
      throw error;
    }
  }

  async assignStaffToOrder(factoryOrderId: string, staffId: string): Promise<FactoryOrder> {
    try {
      const factoryOrder = await this.prisma.factoryOrder.findUnique({
        where: { id: factoryOrderId },
        include: { 
          customerOrder: true,
          factory: true
        }
      });

      if (!factoryOrder) {
        throw new NotFoundException(`Factory order with ID ${factoryOrderId} not found`);
      }

      // Verify the staff exists and belongs to the factory
      const staff = await this.prisma.user.findFirst({
        where: { 
          id: staffId,
          staffedFactory: {
            factoryOwnerId: factoryOrder.factoryId
          }
        }
      });

      if (!staff) {
        throw new NotFoundException(`Staff with ID ${staffId} not found or not associated with the factory`);
      }

      // Create a task for the staff
      const task = await this.prisma.task.create({
        data: {
          taskname: `Production task for order #${factoryOrder.customerOrderId}`,
          description: `Handle production for order #${factoryOrder.customerOrderId}`,
          startDate: new Date(),
          expiredTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          qualityCheckStatus: 'PENDING',
          factoryOrderId: factoryOrderId,
          assignedBy: factoryOrder.factoryId,
          staffTasks: {
            create: {
              userId: staffId,
              assignedDate: new Date(),
              status: 'PENDING'
            }
          }
        }
      });

      // Update the factory order status
      const updatedOrder = await this.prisma.factoryOrder.update({
        where: { id: factoryOrderId },
        data: {
          status: FactoryOrderStatus.IN_PRODUCTION,
          updatedAt: new Date()
        },
        include: this.getIncludeObject()
      });

      // Create notification for the staff
      await this.prisma.notification.create({
        data: {
          userId: staffId,
          title: "New Task Assigned",
          content: `You have been assigned to handle order #${factoryOrder.customerOrderId}`,
          url: `/staff/tasks/${task.id}`
        }
      });

      return new FactoryOrder(updatedOrder);
    } catch (error) {
      this.logger.error(`Error assigning staff to order: ${error.message}`);
      throw error;
    }
  }
}