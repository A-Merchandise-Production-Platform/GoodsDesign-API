import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { StaffTask } from './entity/staff-task.entity';

@Injectable()
export class StaffTaskService {
  constructor(private prisma: PrismaService) {}

  private getIncludeObject() {
    return {
      user: true,
      task: {
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
            }
          },
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
    };
  }

  async findAll(): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      include: this.getIncludeObject()
    });
  }

  async findOne(id: string): Promise<StaffTask> {
    return this.prisma.staffTask.findUnique({
      where: { id },
      include: this.getIncludeObject()
    });
  }

  async findByUserId(userId: string): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      where: { userId },
      include: this.getIncludeObject()
    });
  }

  async findByTaskId(taskId: string): Promise<StaffTask[]> {
    return this.prisma.staffTask.findMany({
      where: { taskId },
      include: this.getIncludeObject()
    });
  }

  async updateStatus(id: string, status: string): Promise<StaffTask> {
    return this.prisma.staffTask.update({
      where: { id },
      data: { status },
      include: this.getIncludeObject()
    });
  }

  async completeTask(id: string): Promise<StaffTask> {
    return this.prisma.staffTask.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
      },
      include: this.getIncludeObject()
    });
  }
} 