import { Args, Query, Resolver } from "@nestjs/graphql"
import { CategoriesService } from "./categories.service"
import { CategoryEntity } from "src/categories/entities/categories.entity"

@Resolver(() => CategoryEntity)
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
}
