import { UseGuards } from "@nestjs/common";
import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { UserEntity } from "src/users/entities/users.entity";
import { FactoryService } from "./factory.service";
import { FactoryEntity } from "./entities/factory.entity";
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto";
import { UpdateFactoryContractDto } from "./dto/update-factory-contract.dto";
import { ForbiddenException } from "@nestjs/common";

@Resolver(() => FactoryEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryResolver {
    constructor(private readonly factoryService: FactoryService) {}

    @Query(() => FactoryEntity, { name: "myFactory" })
    async getMyFactory(@CurrentUser() user: UserEntity) {
        if (user.role !== "FACTORYOWNER") {
            throw new ForbiddenException("Only factory owners can access factory information");
        }
        return this.factoryService.getFactoryByOwnerId(user.id);
    }

    @Mutation(() => FactoryEntity)
    async updateFactoryContract(
        @CurrentUser() user: UserEntity,
        @Args("updateFactoryContractInput") updateFactoryContractDto: UpdateFactoryContractDto
    ) {
        if (user.role !== "FACTORYOWNER") {
            throw new ForbiddenException("Only factory owners can update factory contract");
        }
        return this.factoryService.updateFactoryContract(user.id, updateFactoryContractDto);
    }
}