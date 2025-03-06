import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  @Query(() => [Product], { name: 'products' })
  async getProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @ResolveField()
  async category(@Parent() product: Product) {
    if (product.category) return product.category;
    return this.categoriesService.findOne(product.categoryId);
  }
}