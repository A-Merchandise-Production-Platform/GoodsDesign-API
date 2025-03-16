import { Query, Resolver, ResolveField, Parent } from "@nestjs/graphql"
import { ProductsService } from "./products.service"
import { CategoriesService } from "../categories/categories.service"
import { ProductEntity } from "./entities/products.entity"

@Resolver(() => ProductEntity)
export class ProductsResolver {
    constructor(
        private productsService: ProductsService,
        private categoriesService: CategoriesService
    ) {}

    @Query(() => [ProductEntity], { name: "products" })
    async getProducts(): Promise<ProductEntity[]> {
        return this.productsService.findAll()
    }

    @ResolveField()
    async category(@Parent() product: ProductEntity) {
        if (product.category) return product.category
        return this.categoriesService.findOne(product.categoryId)
    }
}
