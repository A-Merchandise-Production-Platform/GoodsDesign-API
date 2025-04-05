import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Roles, User } from '@prisma/client';
import { GraphqlJwtAuthGuard } from 'src/auth';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AllowedRoles } from '../auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { AdminDashboardResponse, FactoryDashboardResponse, ManagerDashboardResponse } from './dashboard.types';

@Resolver()
@UseGuards(GraphqlJwtAuthGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => AdminDashboardResponse)
  async adminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Query(() => ManagerDashboardResponse)
  async managerDashboard() {
    return this.dashboardService.getManagerDashboard();
  }

  @Query(() => FactoryDashboardResponse)
  async factoryDashboard(@CurrentUser() user: User) {
    return this.dashboardService.getFactoryDashboard(user.id);
  }
} 