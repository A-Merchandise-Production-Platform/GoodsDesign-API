import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckQualityService } from './check-quality.service';
import { CheckQuality } from './entity/check-quality.entity';
import { QualityCheckStatus } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth';
import { CurrentUser } from '../auth';
import { UserEntity } from '../users';

@Resolver(() => CheckQuality)
@UseGuards(GraphqlJwtAuthGuard)
export class CheckQualityResolver {
  constructor(private readonly checkQualityService: CheckQualityService) {}

  @Query(() => [CheckQuality])
  async checkQualities() {
    return this.checkQualityService.findAll();
  }

  @Query(() => CheckQuality)
  async checkQuality(@Args('id', { type: () => ID }) id: string) {
    return this.checkQualityService.findOne(id);
  }

  @Query(() => [CheckQuality])
  async checkQualitiesByTask(@Args('taskId', { type: () => ID }) taskId: string) {
    return this.checkQualityService.findByTaskId(taskId);
  }

  @Mutation(() => CheckQuality)
  async createCheckQuality(
    @CurrentUser() user: UserEntity,
    @Args('taskId', { type: () => ID }) taskId: string,
    @Args('orderDetailId', { type: () => ID }) orderDetailId: string,
    @Args('totalChecked', { type: () => Number }) totalChecked: number,
    @Args('passedQuantity', { type: () => Number }) passedQuantity: number,
    @Args('failedQuantity', { type: () => Number }) failedQuantity: number,
    @Args('status', { type: () => QualityCheckStatus }) status: QualityCheckStatus,
    @Args('reworkRequired', { type: () => Boolean }) reworkRequired: boolean,
    @Args('factoryOrderDetailId', { type: () => ID, nullable: true }) factoryOrderDetailId?: string,
    @Args('note', { type: () => String, nullable: true }) note?: string,
  ) {
    return this.checkQualityService.create({
      taskId,
      orderDetailId,
      factoryOrderDetailId,
      totalChecked,
      passedQuantity,
      failedQuantity,
      status,
      reworkRequired,
      note,
      checkedBy: user.id,
    });
  }

  @Mutation(() => CheckQuality)
  async updateCheckQualityStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => QualityCheckStatus }) status: QualityCheckStatus,
  ) {
    return this.checkQualityService.updateStatus(id, status);
  }
} 