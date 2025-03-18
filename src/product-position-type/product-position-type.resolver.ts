import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductPositionTypeService } from './product-position-type.service';
import { ProductPositionTypeEntity } from './entities/product-position-type.entity';
import { CreateProductPositionTypeDto } from './dto/create-product-position-type.dto';
import { UpdateProductPositionTypeDto } from './dto/update-product-position-type.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';

@Resolver(() => ProductPositionTypeEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class ProductPositionTypeResolver {
  constructor(private readonly productPositionTypeService: ProductPositionTypeService) {}

  @Mutation(() => ProductPositionTypeEntity)
  async createProductPositionType(
    @Args('input') input: CreateProductPositionTypeDto,
  ) {
    return this.productPositionTypeService.create(input);
  }

  @Query(() => [ProductPositionTypeEntity])
  async productPositionTypes(
    @Args('productId') productId: string,
  ) {
    return this.productPositionTypeService.findAll(productId);
  }

  @Query(() => ProductPositionTypeEntity)
  async productPositionType(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productPositionTypeService.findOne(id);
  }

  @Mutation(() => ProductPositionTypeEntity)
  async updateProductPositionType(
    @Args('input') input: UpdateProductPositionTypeDto,
  ) {
    return this.productPositionTypeService.update(input.id, input);
  }

  @Mutation(() => ProductPositionTypeEntity)
  async removeProductPositionType(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productPositionTypeService.remove(id);
  }
} 