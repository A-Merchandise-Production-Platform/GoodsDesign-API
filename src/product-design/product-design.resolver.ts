import { UseGuards } from "@nestjs/common"
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CurrentUser } from "src/auth"
import { UserEntity } from "src/users/entities/users.entity"
import { GraphqlJwtAuthGuard } from "../auth/guards/graphql-jwt-auth.guard"
import { CreateProductDesignDto } from "./dto/create-product-design.dto"
import { UpdateProductDesignDto } from "./dto/update-product-design.dto"
import { ProductDesignEntity } from "./entities/product-design.entity"
import { ProductDesignService } from "./product-design.service"

@Resolver(() => ProductDesignEntity)
export class ProductDesignResolver {
    constructor(private readonly productDesignService: ProductDesignService) {}

    @Mutation(() => ProductDesignEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    async createProductDesign(
        @Args("input") input: CreateProductDesignDto,
        @CurrentUser() { id }: UserEntity
    ) {
        return this.productDesignService.create({
            ...input,
            userId: id
        })
    }

    @Query(() => [ProductDesignEntity])
    @UseGuards(GraphqlJwtAuthGuard)
    async productDesignsByUser(@CurrentUser() { id }: UserEntity) {
        return this.productDesignService.findAll(id)
    }

    @Query(() => [ProductDesignEntity])
    @UseGuards(GraphqlJwtAuthGuard)
    async productDesigns() {
        return this.productDesignService.findAll()
    }

    @Query(() => ProductDesignEntity)
    async productDesign(@Args("id", { type: () => ID }) id: string) {
        return this.productDesignService.findOne(id)
    }

    @Mutation(() => ProductDesignEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    async updateProductDesign(
        @Args("id") id: string,
        @Args("input") input: UpdateProductDesignDto
    ) {
        return this.productDesignService.update(id, input)
    }

    @Mutation(() => ProductDesignEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    async removeProductDesign(@Args("id", { type: () => ID }) id: string) {
        return this.productDesignService.remove(id)
    }

    @Mutation(() => ProductDesignEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    async duplicateProductDesign(
        @Args("id", { type: () => ID }) id: string,
        @CurrentUser() { id: userId }: UserEntity
    ) {
        return this.productDesignService.duplicate(id, userId)
    }

    @Query(() => [ProductDesignEntity])
    async getTemplateProductDesigns() {
        return this.productDesignService.getTemplateProductDesigns()
    }
    @Query(() => [ProductDesignEntity])
    async publicProductDesigns() {
        return this.productDesignService.getPublicProductDesigns()
    }
}
