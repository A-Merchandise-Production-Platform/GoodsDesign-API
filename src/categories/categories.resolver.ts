import { Query, Resolver } from '@nestjs/graphql';
import { Category } from './models/category.model';
import { CategoriesService } from './categories.service';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'categories' })
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
}