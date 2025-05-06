import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql"
import { SystemConfigVariantService } from "./system-config-variant.service"
import { SystemConfigVariantEntity } from "./entities/system-config-variant.entity"
import { CreateSystemConfigVariantInput } from "./dto/create-system-config-variant.input"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { UpdateSystemConfigVariantInput } from "./dto/update-system-config-variant.input"
import { VariantAttributes } from "./entities/variant-attributes.type"

@Resolver(() => SystemConfigVariantEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class SystemConfigVariantResolver {
    constructor(private readonly systemConfigVariantService: SystemConfigVariantService) {}

    @Mutation(() => SystemConfigVariantEntity)
    async createSystemConfigVariant(
        @Args("createSystemConfigVariantInput")
        createSystemConfigVariantInput: CreateSystemConfigVariantInput
    ) {
        return this.systemConfigVariantService.create(createSystemConfigVariantInput)
    }

    @Query(() => [SystemConfigVariantEntity], { name: "systemConfigVariants" })
    async findAll() {
        return this.systemConfigVariantService.findAll()
    }

    @Query(() => SystemConfigVariantEntity, { name: "systemConfigVariant" })
    async findOne(@Args("id", { type: () => String }) id: string) {
        return this.systemConfigVariantService.findOne(id)
    }

    @Query(() => [SystemConfigVariantEntity], { name: "systemConfigVariantsByProduct" })
    async findByProduct(@Args("productId", { type: () => String }) productId: string) {
        return this.systemConfigVariantService.findByProduct(productId)
    }

    @Mutation(() => SystemConfigVariantEntity)
    async updateSystemConfigVariant(
        @Args("updateSystemConfigVariantInput")
        updateSystemConfigVariantInput: UpdateSystemConfigVariantInput
    ) {
        return this.systemConfigVariantService.update(
            updateSystemConfigVariantInput.id,
            updateSystemConfigVariantInput
        )
    }

    @Mutation(() => SystemConfigVariantEntity)
    async removeSystemConfigVariant(@Args("id", { type: () => String }) id: string) {
        return this.systemConfigVariantService.remove(id)
    }

    @Query(() => VariantAttributes, { name: "distinctVariantAttributes" })
    async getDistinctVariantAttributes(
        @Args("productId", { type: () => String }) productId: string
    ) {
        return this.systemConfigVariantService.getDistinctVariantAttributes(productId)
    }
}
