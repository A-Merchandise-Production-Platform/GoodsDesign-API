import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { GraphqlJwtAuthGuard } from "src/auth"
import { CreateFactoryProductInput } from "src/factory-products/dto/create-factory-product.input"
import { UpdateFactoryProductInput } from "src/factory-products/dto/update-factory-product.input"
import { FactoryProductEntity } from "./entities/factory-product.entity"
import { FactoryProductsService } from "./factory-products.service"

@Resolver(() => FactoryProductEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class FactoryProductsResolver {
    constructor(private readonly factoryProductsService: FactoryProductsService) {}

    @Query(() => [FactoryProductEntity], { name: "factoryProducts" })
    async factoryProducts() {
        return this.factoryProductsService.findAll()
    }

    @Query(() => FactoryProductEntity, { name: "factoryProduct" })
    async factoryProduct(
        @Args("factoryId") factoryId: string,
        @Args("systemConfigVariantId") systemConfigVariantId: string
    ) {
        return this.factoryProductsService.findOne(factoryId, systemConfigVariantId)
    }

    @Mutation(() => FactoryProductEntity, { name: "createFactoryProduct" })
    async createFactoryProduct(@Args("data") data: CreateFactoryProductInput) {
        return this.factoryProductsService.create(data)
    }

    @Mutation(() => FactoryProductEntity, { name: "updateFactoryProduct" })
    async updateFactoryProduct(
        @Args("factoryId") factoryId: string,
        @Args("systemConfigVariantId") systemConfigVariantId: string,
        @Args("data") data: UpdateFactoryProductInput
    ) {
        return this.factoryProductsService.update(factoryId, systemConfigVariantId, data)
    }

    @Mutation(() => FactoryProductEntity, { name: "deleteFactoryProduct" })
    async deleteFactoryProduct(
        @Args("factoryId") factoryId: string,
        @Args("systemConfigVariantId") systemConfigVariantId: string
    ) {
        return this.factoryProductsService.delete(factoryId, systemConfigVariantId)
    }
}
