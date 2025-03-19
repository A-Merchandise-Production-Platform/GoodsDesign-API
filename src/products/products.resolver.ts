import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UserEntity } from "src/users/entities/users.entity"
import { CreateProductDto } from "./dto/create-product.dto"
import { ProductEntity } from "./entities/products.entity"
import { ProductsService } from "./products.service"
import { UpdateProductDto } from "src/products/dto/update-product.dto"

@Resolver(() => ProductEntity)
export class ProductsResolver {
    constructor(private productsService: ProductsService) {}

    @Query(() => [ProductEntity], { name: "products" })
    async getProducts(): Promise<ProductEntity[]> {
        return this.productsService.findAll()
    }

    @Query(() => ProductEntity, { name: "product" })
    async getProduct(@Args("id") id: string): Promise<ProductEntity> {
        return this.productsService.findOne(id)
    }

    @UseGuards(GraphqlJwtAuthGuard)
    @Mutation(() => ProductEntity, { name: "createProduct" })
    async createProduct(
        @Args("input") input: CreateProductDto,
        @CurrentUser() user: UserEntity
    ): Promise<ProductEntity> {
        return this.productsService.create(input, user.id)
    }

    @UseGuards(GraphqlJwtAuthGuard)
    @Mutation(() => ProductEntity, { name: "updateProduct" })
    async updateProduct(
        @Args("id") id: string,
        @Args("input") input: UpdateProductDto,
        @CurrentUser() user: UserEntity
    ): Promise<ProductEntity> {
        return this.productsService.update(id, input, user.id)
    }

    @UseGuards(GraphqlJwtAuthGuard)
    @Mutation(() => ProductEntity, { name: "deleteProduct" })
    async deleteProduct(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<ProductEntity> {
        return this.productsService.remove(id, user.id)
    }

    @UseGuards(GraphqlJwtAuthGuard)
    @Mutation(() => ProductEntity, { name: "restoreProduct" })
    async restoreProduct(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<ProductEntity> {
        return this.productsService.restore(id, user.id)
    }

    @UseGuards(GraphqlJwtAuthGuard)
    @Mutation(() => ProductEntity, { name: "toggleActiveProduct" })
    async toggleActiveProduct(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<ProductEntity> {
        return this.productsService.toggleActive(id, user.id)
    }
}
