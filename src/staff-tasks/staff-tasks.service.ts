import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma"
import { StaffTask } from "./entity/staff-task.entity"
import { StaffTaskStatus } from "@prisma/client"

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
                                            systemConfigVariant: {
                                                include: {
                                                    product: true
                                                }
                                            }
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
                                                            systemConfigVariant: {
                                                                include: {
                                                                    product: true
                                                                }
                                                            }
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
                                            systemConfigVariant: {
                                                include: {
                                                    product: true
                                                }
                                            }
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
        }
    }

    async findAll(): Promise<StaffTask[]> {
        const data = await this.prisma.staffTask.findMany({
            include: this.getIncludeObject()
        })
        return data.map((item) => new StaffTask(item))
    }

    async findOne(id: string): Promise<StaffTask> {
        const data = await this.prisma.staffTask.findUnique({
            where: { id },
            include: this.getIncludeObject()
        })
        return new StaffTask(data)
    }

    async findByUserId(userId: string): Promise<StaffTask[]> {
        const data = await this.prisma.staffTask.findMany({
            where: { userId },
            include: this.getIncludeObject()
        })
        return data.map((item) => new StaffTask(item))
    }

    async findByTaskId(taskId: string): Promise<StaffTask[]> {
        const data = await this.prisma.staffTask.findMany({
            where: { taskId },
            include: this.getIncludeObject()
        })
        return data.map((item) => new StaffTask(item))
    }

    async updateStatus(id: string, status: StaffTaskStatus): Promise<StaffTask> {
        const data = await this.prisma.staffTask.update({
            where: { id },
            data: { status },
            include: this.getIncludeObject()
        })
        return new StaffTask(data)
    }

    async completeTask(id: string): Promise<StaffTask> {
        const data = await this.prisma.staffTask.update({
            where: { id },
            data: {
                status: "COMPLETED",
                completedDate: new Date()
            },
            include: this.getIncludeObject()
        })
        return new StaffTask(data)
    }
}
