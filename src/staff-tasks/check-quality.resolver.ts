import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CheckQualityService } from './check-quality.service';
import { CheckQuality } from './entity/check-quality.entity';
import { QualityCheckStatus } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth';
import { CurrentUser } from '../auth';
import { UserEntity } from '../users';
import { CreateCheckQualityDto } from './dto/create-check-quality.dto';
import { UpdateCheckQualityDto } from './dto/update-check-quality.dto';
import { DoneCheckQualityDto } from './dto/done-check-quality.dto';

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
    @Args('input') input: CreateCheckQualityDto,
  ) {
    return this.checkQualityService.create({
      ...input,
      checkedBy: user.id,
    });
  }

  @Mutation(() => CheckQuality)
  async doneCheckQuality(
    @CurrentUser() user: UserEntity,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: DoneCheckQualityDto,
  ) {
    return this.checkQualityService.doneTaskCheckQuality(id, {
      ...input,
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