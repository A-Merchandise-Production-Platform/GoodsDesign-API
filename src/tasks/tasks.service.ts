import { Injectable } from "@nestjs/common"
import { TaskStatus } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { TaskEntity } from "./entities/task.entity"

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) {}

    async findTasksByStaffId(staffId: string) {
        const tasks = await this.prisma.task.findMany({
            where: {
                userId: staffId
            },
            include: {
                checkQualities: true,
                order: true
            }
        })

        return tasks.map((task) => new TaskEntity(task))
    }

    async findActiveTasksByStaffId(staffId: string) {
        const tasks = await this.prisma.task.findMany({
            where: {
                userId: staffId,
                status: {
                    notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED]
                }
            },
            include: {
                checkQualities: true,
                order: true
            },
            orderBy: {
                completedDate: "asc"
            }
        })

        return tasks.map((task) => new TaskEntity(task))
    }

    async findTasksHistoryByStaffId(staffId: string) {
        const tasks = await this.prisma.task.findMany({
            where: {
                userId: staffId
            },
            include: {
                checkQualities: true,
                order: true
            },
            orderBy: {
                startDate: "desc"
            }
        })

        return tasks.map((task) => new TaskEntity(task))
    }
}
