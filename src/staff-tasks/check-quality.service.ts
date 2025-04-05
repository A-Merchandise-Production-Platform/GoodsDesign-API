import { BadRequestException, Injectable } from '@nestjs/common';
import { FactoryOrderStatus, OrderDetailStatus, QualityCheckStatus, StaffTaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma';
import { CreateCheckQualityDto } from './dto/create-check-quality.dto';
import { DoneCheckQualityDto } from './dto/done-check-quality.dto';
import { CheckQuality } from './entity/check-quality.entity';

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
        },
        task: {
          include: {
            staffTasks: true
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
    } else if (data.failedQuantity !== 0) {
      // All items failed
      status = QualityCheckStatus.REJECTED;
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

    // Update task and staff task status
    if (currentCheckQuality.task) {
      // Update task status
      await this.prisma.task.update({
        where: { id: currentCheckQuality.taskId },
        data: {
          qualityCheckStatus: status,
        }
      });

      // Update staff task status
      const staffTask = currentCheckQuality.task.staffTasks[0];
      if (staffTask) {
        await this.prisma.staffTask.update({
          where: { id: staffTask.id },
          data: {
            status: StaffTaskStatus.COMPLETED,
            completedDate: new Date()
          }
        });
      }
    }

    // If rework is required, handle factory order details and change status
    if (data.failedQuantity > 0) {
      // Update the customer order detail status
      await this.prisma.factoryOrder.update({
        where: { id: currentCheckQuality.factoryOrderDetail.factoryOrderId },
        data: {
          status: OrderDetailStatus.REWORK_REQUIRED,
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
              productionCost: factoryOrderDetail.productionCost,
              qualityStatus: QualityCheckStatus.PENDING,
              isRework: true
            }
          });

          //change factory order details others into isRework = false
          await this.prisma.factoryOrderDetail.updateMany({
            where: {
              factoryOrderId: factoryOrder.id,
              id: {
                not: currentCheckQuality.factoryOrderDetailId
              }
            },
            data: {
              isRework: false
            }
          });

          await this.prisma.factoryOrderDetail.update({
            where: { id: factoryOrderDetail.id },
            data: {
              qualityStatus: QualityCheckStatus.REJECTED
            }
          });
          
        }else{
          
        }

        // Update the factory order status
        await this.prisma.factoryOrder.update({
          where: { id: factoryOrder.id },
          data: {
            status: FactoryOrderStatus.REWORK_REQUIRED,
            isDelayed: true,
            delayReason: 'Rework required due to quality issues',
            currentProgress: 0 // Reset progress since new items need to be produced
          }
        });
      }
    }else{
      const factoryOrderDetail = currentCheckQuality.factoryOrderDetail;
        const factoryOrder = factoryOrderDetail.factoryOrder;
      await this.prisma.factoryOrderDetail.update({
        where: { id: factoryOrderDetail.id },
        data: {
          qualityStatus: QualityCheckStatus.APPROVED
        }
      });
    }

    return new CheckQuality(result);
  }
} 