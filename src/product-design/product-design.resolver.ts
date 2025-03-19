import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductDesignService } from './product-design.service';
import { ProductDesignEntity } from './entities/product-design.entity';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { UpdateProductDesignDto } from './dto/update-product-design.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';

@Resolver(() => ProductDesignEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class ProductDesignResolver {
  constructor(private readonly productDesignService: ProductDesignService) {}

  @Mutation(() => ProductDesignEntity)
  async createProductDesign(
    @Args('input') input: CreateProductDesignDto,
  ) {
    return this.productDesignService.create(input);
  }

  @Query(() => [ProductDesignEntity])
  async productDesigns(
    @Args('userId', { nullable: true }) userId?: string,
  ) {
    return this.productDesignService.findAll(userId);
  }

  @Query(() => ProductDesignEntity)
  async productDesign(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productDesignService.findOne(id);
  }

  @Mutation(() => ProductDesignEntity)
  async updateProductDesign(
    @Args('input') input: UpdateProductDesignDto,
  ) {
    return this.productDesignService.update(input.id, input);
  }

  @Mutation(() => ProductDesignEntity)
  async removeProductDesign(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productDesignService.remove(id);
  }
} 