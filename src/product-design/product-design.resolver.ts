import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth';
import { UserEntity } from 'src/users/entities/users.entity';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { UpdateProductDesignDto } from './dto/update-product-design.dto';
import { ProductDesignEntity } from './entities/product-design.entity';
import { ProductDesignService } from './product-design.service';

@Resolver(() => ProductDesignEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class ProductDesignResolver {
  constructor(private readonly productDesignService: ProductDesignService) {}

  @Mutation(() => ProductDesignEntity)
  async createProductDesign(
    @Args('input') input: CreateProductDesignDto,
    @CurrentUser() { id }: UserEntity
  ) {
    return this.productDesignService.create({
      ...input,
      userId: id
    });
  }

  @Query(() => [ProductDesignEntity])
  async productDesignsByUser(
    @CurrentUser() { id }: UserEntity
  ) {
    return this.productDesignService.findAll(id);
  }

  @Query(() => [ProductDesignEntity])
  async productDesigns() {
    return this.productDesignService.findAll();
  }

  @Query(() => ProductDesignEntity)
  async productDesign(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productDesignService.findOne(id);
  }

  @Mutation(() => ProductDesignEntity)
  async updateProductDesign(
    @Args("id") id: string,
    @Args('input') input: UpdateProductDesignDto,
  ) {
    return this.productDesignService.update(id, input);
  }

  @Mutation(() => ProductDesignEntity)
  async removeProductDesign(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.productDesignService.remove(id);
  }

  @Mutation(() => ProductDesignEntity)
  async duplicateProductDesign(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() { id: userId }: UserEntity
  ) {
    return this.productDesignService.duplicate(id, userId);
  }
} 