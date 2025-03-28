import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductDesignService } from './product-design.service';
import { ProductDesignEntity } from './entities/product-design.entity';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { UpdateProductDesignDto } from './dto/update-product-design.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CurrentUser } from 'src/auth';
import { UserEntity } from 'src/users/entities/users.entity';

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
  async productDesigns(
    @CurrentUser() { id }: UserEntity
  ) {
    return this.productDesignService.findAll(id);
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
} 