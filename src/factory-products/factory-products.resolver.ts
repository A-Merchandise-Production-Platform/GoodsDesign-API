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

    @Query(() => [FactoryProductEntity])
    async factoryProducts() {
        return this.factoryProductsService.findAll()
    }

    @Query(() => FactoryProductEntity)
    async factoryProduct(@Args("id") id: string) {
        return this.factoryProductsService.findOne(id)
    }

    @Mutation(() => FactoryProductEntity)
    async createFactoryProduct(@Args("data") data: CreateFactoryProductInput) {
        return this.factoryProductsService.create(data)
    }

    @Mutation(() => FactoryProductEntity)
    async updateFactoryProduct(
        @Args("id") id: string,
        @Args("data") data: UpdateFactoryProductInput
    ) {
        return this.factoryProductsService.update(id, data)
    }

    @Mutation(() => FactoryProductEntity)
    async deleteFactoryProduct(@Args("id") id: string) {
        return this.factoryProductsService.delete(id)
    }
}
