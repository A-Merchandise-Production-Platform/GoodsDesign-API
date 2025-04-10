import { UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "src/auth"
import { TaskEntity } from "./entities/task.entity"
import { TasksService } from "./tasks.service"

@Resolver(() => TaskEntity)
export class TasksResolver {
    constructor(private readonly tasksService: TasksService) {}

    @Query(() => [TaskEntity])
    @UseGuards(GraphqlJwtAuthGuard)
    findTasksByStaffId(@Args("staffId", { type: () => String }) staffId: string) {
        return this.tasksService.findTasksByStaffId(staffId)
    }
}
