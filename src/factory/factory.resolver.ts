import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UpdateFactoryStatusDto } from "src/factory/dto/update-factory-status"
import { UserEntity } from "src/users/entities/users.entity"
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto"
import { FactoryEntity } from "./entities/factory.entity"
import { FactoryService } from "./factory.service"

@Resolver(() => FactoryEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryResolver {
    constructor(private readonly factoryService: FactoryService) {}

    @Mutation(() => FactoryEntity)
    async updateFactoryInfo(
        @CurrentUser() user: UserEntity,
        @Args("updateFactoryInfoInput") updateFactoryInfoDto: UpdateFactoryInfoDto
    ) {
        return this.factoryService.updateFactoryInfo(user.id, updateFactoryInfoDto)
    }

    @Query(() => FactoryEntity)
    async getMyFactory(@CurrentUser() user: UserEntity) {
        return this.factoryService.getMyFactory(user.id)
    }

    @Query(() => [FactoryEntity])
    async getAllFactories() {
        return this.factoryService.getAllFactories()
    }

    @Mutation(() => FactoryEntity)
    async assignStaffToFactory(
        @CurrentUser() user: UserEntity,
        @Args("factoryId") factoryId: string,
        @Args("staffId") staffId: string
    ) {
        return this.factoryService.assignStaffToFactory(factoryId, staffId, user)
    }

    @Query(() => FactoryEntity)
    async getFactoryById(@Args("factoryId") factoryId: string) {
        return this.factoryService.getFactoryById(factoryId)
    }

    @Mutation(() => FactoryEntity)
    async changeFactoryStatus(
        @CurrentUser() user: UserEntity,
        @Args("data") data: UpdateFactoryStatusDto
    ) {
        return this.factoryService.changeFactoryStatus(data, user)
    }
}
