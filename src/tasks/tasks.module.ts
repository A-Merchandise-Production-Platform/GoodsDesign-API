import { Module } from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { TasksResolver } from "./tasks.resolver"
import { PrismaModule } from "src/prisma"

@Module({
    imports: [PrismaModule],
    providers: [TasksResolver, TasksService],
    exports: [TasksService]
})
export class TasksModule {}
