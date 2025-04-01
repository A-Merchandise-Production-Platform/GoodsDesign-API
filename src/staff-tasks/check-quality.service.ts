import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CheckQuality } from './entity/check-quality.entity';
import { QualityCheckStatus } from '@prisma/client';

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

  async update(id: string, data: {
    totalChecked?: number;
    passedQuantity?: number;
    failedQuantity?: number;
    status?: QualityCheckStatus;
    reworkRequired?: boolean;
    note?: string;
    checkedBy?: string;
  }): Promise<CheckQuality> {
    const result = await this.prisma.checkQuality.update({
      where: { id },
      data: {
        ...data,
        checkedAt: new Date()
      },
      include: this.getIncludeObject()
    });
    return new CheckQuality(result);
  }
} 