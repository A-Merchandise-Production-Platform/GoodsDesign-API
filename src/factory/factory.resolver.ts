import { UseGuards } from "@nestjs/common"
import { Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { FactoryEntity } from "./entities/factory.entity"
import { FactoryService } from "./factory.service"

@Resolver(() => FactoryEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryResolver {
    constructor(private readonly factoryService: FactoryService) {}
}
