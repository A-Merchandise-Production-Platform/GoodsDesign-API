import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma"
import { TaskEntity } from "src/tasks/entities/task.entity"

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
}
