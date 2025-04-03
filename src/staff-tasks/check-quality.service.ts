import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CheckQuality } from './entity/check-quality.entity';
import { QualityCheckStatus, ReworkStatus, OrderDetailStatus, FactoryOrderStatus } from '@prisma/client';
import { CreateCheckQualityDto } from './dto/create-check-quality.dto';
import { UpdateCheckQualityDto } from './dto/update-check-quality.dto';
import { DoneCheckQualityDto } from './dto/done-check-quality.dto';

@Injectable()
export class CheckQualityService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject() {
    return {
      task: {
        include: {
          checkQualities: true,
          staffTasks: {
            include: {
              user: true,
              task: {
                include: {
                  checkQualities: true,
                  staffTasks: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      },
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
          factoryOrder: {
            include: {
              customerOrder: true,
              orderDetails: {
                include: {
                  design: {
                    include: {
                      user: true,
                      systemConfigVariant: true
                    }
                  },
                  orderDetail: true,
                  checkQualities: true
                }
              },
              progressReports: {
                include: {
                  factoryOrder: true
                }
              },
              qualityIssues: {
                include: {
                  factoryOrder: true
                }
              },
              tasks: {
                include: {
                  checkQualities: true,
                  staffTasks: {
                    include: {
                      user: true,
                      task: {
                        include: {
                          checkQualities: true,
                          staffTasks: {
                            include: {
                              user: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          design: {
            include: {
              user: true,
              systemConfigVariant: true
            }
          },
          orderDetail: true,
          checkQualities: true
        }
      }
    };
  }

  async findAll(): Promise<CheckQuality[]> {
    const data = await this.prisma.checkQuality.findMany({
      include: this.getIncludeObject()
    });
    return data.map(item => new CheckQuality(item));
  }

  async findOne(id: string): Promise<CheckQuality> {
    const data = await this.prisma.checkQuality.findUnique({
      where: { id },
      include: this.getIncludeObject()
    });
    return new CheckQuality(data);
  }

  async findByTaskId(taskId: string): Promise<CheckQuality[]> {
    const data = await this.prisma.checkQuality.findMany({
      where: { taskId },
      include: this.getIncludeObject()
    });
    return data.map(item => new CheckQuality(item));
  }

  async create(data: CreateCheckQualityDto & { checkedBy?: string }): Promise<CheckQuality> {
    const result = await this.prisma.checkQuality.create({
      data: {
        ...data,
        checkedAt: new Date(),
      },
      include: this.getIncludeObject()
    });
    return new CheckQuality(result);
  }

  async updateStatus(id: string, status: QualityCheckStatus): Promise<CheckQuality> {
    const data = await this.prisma.checkQuality.update({
      where: { id },
      data: { status },
      include: this.getIncludeObject()
    });
    return new CheckQuality(data);
  }

  async doneTaskCheckQuality(id: string, data: DoneCheckQualityDto & { checkedBy?: string }): Promise<CheckQuality> {
    // Get the current check quality record to calculate total checked
    const currentCheckQuality = await this.prisma.checkQuality.findUnique({
      where: { id },
      include: {
        orderDetail: true,
        factoryOrderDetail: {
          include: {
            factoryOrder: true,
            design: true,
            orderDetail: true
          }
        }
      }
    });

    if (!currentCheckQuality) {
      throw new Error('Check quality record not found');
    }

    // Validate that passed + failed equals total checked
    const calculatedTotal = data.passedQuantity + data.failedQuantity;
    if (calculatedTotal !== currentCheckQuality.totalChecked) {
      throw new BadRequestException(
        `Total checked (${currentCheckQuality.totalChecked}) must equal the sum of passed (${data.passedQuantity}) and failed (${data.failedQuantity}) quantities (${calculatedTotal})`
      );
    }

    // Determine status based on failed and passed quantities
    let status: QualityCheckStatus;
    
    if (data.failedQuantity === 0) {
      // All items passed
      status = QualityCheckStatus.APPROVED;
    } else if (data.passedQuantity === 0) {
      // All items failed
      status = QualityCheckStatus.REJECTED;
    } else {
      // Some items passed, some failed
      status = QualityCheckStatus.PARTIAL_APPROVED;
    }

    // Update the check quality record
    const result = await this.prisma.checkQuality.update({
      where: { id },
      data: {
        ...data,
        status,
        checkedAt: new Date(),
      },
      include: this.getIncludeObject(),
    });

    // If rework is required, handle factory order details and change status
    if (data.reworkRequired) {
      // Update the customer order detail status
      await this.prisma.customerOrderDetail.update({
        where: { id: currentCheckQuality.orderDetailId },
        data: {
          reworkStatus: ReworkStatus.IN_PROGRESS,
          status: OrderDetailStatus.REWORK_REQUIRED
        },
      });

      // If there's a factory order detail, update its status and create new order details
      if (currentCheckQuality.factoryOrderDetailId && currentCheckQuality.factoryOrderDetail) {
        const factoryOrderDetail = currentCheckQuality.factoryOrderDetail;
        const factoryOrder = factoryOrderDetail.factoryOrder;
        
        // Update the factory order detail status
        await this.prisma.factoryOrderDetail.update({
          where: { id: currentCheckQuality.factoryOrderDetailId },
          data: {
            status: OrderDetailStatus.REWORK_REQUIRED,
            rejectedQty: data.failedQuantity
          },
        });

        // Create a new factory order detail for the rework items
        if (data.failedQuantity > 0) {
          await this.prisma.factoryOrderDetail.create({
            data: {
              designId: factoryOrderDetail.designId,
              factoryOrderId: factoryOrder.id,
              orderDetailId: currentCheckQuality.orderDetailId,
              quantity: data.failedQuantity,
              price: factoryOrderDetail.price,
              status: OrderDetailStatus.PENDING,
              completedQty: 0,
              rejectedQty: 0,
              productionCost: factoryOrderDetail.productionCost
            }
          });
        }

        // Update the factory order status
        await this.prisma.factoryOrder.update({
          where: { id: factoryOrder.id },
          data: {
            status: FactoryOrderStatus.IN_PRODUCTION,
            isDelayed: true,
            delayReason: 'Rework required due to quality issues',
            currentProgress: 0 // Reset progress since new items need to be produced
          }
        });
      }
    }

    return new CheckQuality(result);
  }
} 