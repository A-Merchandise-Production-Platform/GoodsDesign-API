import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FactoryProgressReport } from './entity/factory-progress-report.entity';
import { FactoryProgressReportService } from './factory-progress-report.service';
import { CreateFactoryProgressReportDto } from './dto/create-factory-progress-report.dto';
import { GraphqlJwtAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/users.entity';

@Resolver(() => FactoryProgressReport)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryProgressReportResolver {
  constructor(private readonly factoryProgressReportService: FactoryProgressReportService) {}

  @Mutation(() => FactoryProgressReport)
  async createFactoryProgressReport(
    @Args('input') createFactoryProgressReportDto: CreateFactoryProgressReportDto,
    @CurrentUser() user: UserEntity
  ) {
    return this.factoryProgressReportService.create(createFactoryProgressReportDto);
  }

  @Query(() => [FactoryProgressReport])
  async factoryProgressReports(
    @Args('factoryOrderId', { type: () => ID }) factoryOrderId: string
  ) {
    return this.factoryProgressReportService.findByFactoryOrder(factoryOrderId);
  }

  @Query(() => FactoryProgressReport)
  async factoryProgressReport(
    @Args('id', { type: () => ID }) id: string
  ) {
    return this.factoryProgressReportService.findOne(id);
  }
} 