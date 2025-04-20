import { UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { Roles, User } from "@prisma/client"
import { GraphqlJwtAuthGuard } from "src/auth"
import { CurrentUser } from "../auth/decorators/current-user.decorator"
import { AllowedRoles } from "../auth/decorators/roles.decorator"
import { DashboardService } from "./dashboard.service"
import {
    AdminDashboardResponse,
    EnhancedManagerDashboardResponse,
    FactoryDashboardResponse,
    FactoryDetailDashboardResponse,
    ManagerDashboardResponse,
    StaffDashboardResponse
} from "./dashboard.types"
import { ManagerOrderDashboardEntity } from "src/dashboard/entity/manager-order.entity"

@Resolver()
@UseGuards(GraphqlJwtAuthGuard)
export class DashboardResolver {
    constructor(private readonly dashboardService: DashboardService) {}

    @Query(() => AdminDashboardResponse)
    @AllowedRoles(Roles.ADMIN)
    async getAdminDashboard(@CurrentUser() user: User) {
        return this.dashboardService.getAdminDashboard(user.id)
    }

    @Query(() => ManagerDashboardResponse)
    @AllowedRoles(Roles.MANAGER, Roles.ADMIN)
    async getManagerDashboard(@CurrentUser() user: User) {
        return this.dashboardService.getManagerDashboard(user.id)
    }

    @Query(() => EnhancedManagerDashboardResponse)
    @AllowedRoles(Roles.MANAGER, Roles.ADMIN)
    async getEnhancedManagerDashboard(@CurrentUser() user: User) {
        return this.dashboardService.getEnhancedManagerDashboard(user.id)
    }

    @Query(() => FactoryDashboardResponse)
    @AllowedRoles(Roles.FACTORYOWNER, Roles.ADMIN)
    async getFactoryDashboard(@CurrentUser() user: User) {
        return this.dashboardService.getFactoryDashboard(user.id)
    }

    @Query(() => ManagerOrderDashboardEntity)
    @AllowedRoles(Roles.MANAGER, Roles.ADMIN)
    async getManagerOrderDashboard(@CurrentUser() user: User) {
        return this.dashboardService.getManagerOrderDashboard(user)
    }

    @Query(() => FactoryDetailDashboardResponse)
    @AllowedRoles(Roles.FACTORYOWNER, Roles.ADMIN)
    async getFactoryDetailDashboard(@Args("factoryId") factoryId: string) {
        return this.dashboardService.getFactoryDetailDashboard(factoryId)
    }

    @Query(() => StaffDashboardResponse)
    @AllowedRoles(Roles.STAFF)
    async getStaffDashboard(@Args("userId") userId: string) {
        return this.dashboardService.getStaffDashboard(userId)
    }
}
