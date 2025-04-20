import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { UpdateSystemConfigOrderDto } from "./dto/update-system-config-order.dto"
import { SystemConfigOrderEntity } from "./entities/system-config-order.entity"
import { SystemConfigOrderService } from "./system-config-order.service"

@Resolver(() => SystemConfigOrderEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class SystemConfigOrderResolver {
    constructor(private readonly configService: SystemConfigOrderService) {}

    @Query(() => SystemConfigOrderEntity)
    async systemConfigOrder(): Promise<SystemConfigOrderEntity> {
        return this.configService.findOne()
    }

    @Mutation(() => SystemConfigOrderEntity)
    async updateSystemConfigOrder(
        @Args("updateConfigInput") updateDto: UpdateSystemConfigOrderDto
    ): Promise<SystemConfigOrderEntity> {
        return this.configService.update(updateDto)
    }
} 