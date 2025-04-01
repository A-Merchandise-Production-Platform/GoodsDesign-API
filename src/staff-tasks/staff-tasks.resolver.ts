import { Args, ID, Query, Resolver, Mutation } from '@nestjs/graphql';
import { StaffTaskService } from './staff-tasks.service';
import { StaffTask } from './entity/staff-task.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth';
import { CurrentUser } from '../auth';
import { UserEntity } from '../users';

@Resolver(() => StaffTask)
@UseGuards(GraphqlJwtAuthGuard)
export class StaffTaskResolver {
  constructor(private readonly staffTaskService: StaffTaskService) {}

  @Query(() => [StaffTask])
  async staffTasks() {
    return this.staffTaskService.findAll();
  }

  @Query(() => StaffTask)
  async staffTask(@Args('id', { type: () => ID }) id: string) {
    return this.staffTaskService.findOne(id);
  }

  @Query(() => [StaffTask])
  async myStaffTasks(@CurrentUser() user: UserEntity) {
    return this.staffTaskService.findByUserId(user.id);
  }

  @Query(() => [StaffTask])
  async staffTasksByTask(@Args('taskId', { type: () => ID }) taskId: string) {
    return this.staffTaskService.findByTaskId(taskId);
  }

  @Mutation(() => StaffTask)
  async updateStaffTaskStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => String }) status: string,
  ) {
    return this.staffTaskService.updateStatus(id, status);
  }

  @Mutation(() => StaffTask)
  async completeStaffTask(@Args('id', { type: () => ID }) id: string) {
    return this.staffTaskService.completeTask(id);
  }
} 