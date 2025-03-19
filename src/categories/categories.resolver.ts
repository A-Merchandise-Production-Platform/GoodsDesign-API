import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { CategoriesService } from "./categories.service"
import { CategoryEntity } from "src/categories/entities/categories.entity"
import { CreateCategoryDto } from "src/categories/dto/create-category.dto"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { UserEntity } from "src/users/entities/users.entity"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { UpdateCategoryDto } from "src/categories/dto/update-category.dto"

@Resolver(() => CategoryEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class CategoriesResolver {
    constructor(private categoriesService: CategoriesService) {}

    @Query(() => [CategoryEntity], { name: "categories" })
    async getCategories(): Promise<CategoryEntity[]> {
        return this.categoriesService.findAll()
    }

    @Query(() => CategoryEntity, { name: "category" })
    async getCategory(@Args("id") id: string): Promise<CategoryEntity> {
        return this.categoriesService.findOne(id)
    }

    @Mutation(() => CategoryEntity)
    async createCategory(
        @Args("createCategoryInput") createCategoryInput: CreateCategoryDto,
        @CurrentUser() user: UserEntity
    ): Promise<CategoryEntity> {
        return this.categoriesService.create(createCategoryInput, user.id)
    }

    @Mutation(() => CategoryEntity)
    async updateCategory(
        @Args("id") id: string,
        @Args("updateCategoryInput") updateCategoryInput: UpdateCategoryDto,
        @CurrentUser() user: UserEntity
    ): Promise<CategoryEntity> {
        return this.categoriesService.update(id, updateCategoryInput, user.id)
    }

    @Mutation(() => CategoryEntity)
    async deleteCategory(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<CategoryEntity> {
        return this.categoriesService.remove(id, user.id)
    }

    @Mutation(() => CategoryEntity)
    async restoreCategory(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<CategoryEntity> {
        return this.categoriesService.restore(id, user.id)
    }

    @Mutation(() => CategoryEntity)
    async toggleActiveCategory(
        @Args("id") id: string,
        @CurrentUser() user: UserEntity
    ): Promise<CategoryEntity> {
        return this.categoriesService.toggleActive(id, user.id)
    }
}
