import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductDesignService } from './product-design.service';
import { ProductDesignEntity } from './entities/product-design.entity';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { UpdateProductDesignDto } from './dto/update-product-design.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => ProductDesignEntity)
@UseGuards(JwtAuthGuard)
export class ProductDesignResolver {
  constructor(private readonly productDesignService: ProductDesignService) {}

  @Mutation(() => ProductDesignEntity)
  async createProductDesign(
    @Args('createProductDesignInput') createProductDesignDto: CreateProductDesignDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.productDesignService.create({
      ...createProductDesignDto,
      userId,
    });
  }

  @Query(() => [ProductDesignEntity])
  async findAllProductDesigns(@CurrentUser('id') userId: string) {
    return this.productDesignService.findAll(userId);
  }

  @Query(() => ProductDesignEntity)
  async findOneProductDesign(@Args('id', { type: () => ID }) id: string) {
    return this.productDesignService.findOne(id);
  }

  @Mutation(() => ProductDesignEntity)
  async updateProductDesign(
    @Args('updateProductDesignInput') updateProductDesignDto: UpdateProductDesignDto,
  ) {
    return this.productDesignService.update(updateProductDesignDto.id, updateProductDesignDto);
  }

  @Mutation(() => ProductDesignEntity)
  async removeProductDesign(@Args('id', { type: () => ID }) id: string) {
    return this.productDesignService.remove(id);
  }

  @Mutation(() => ProductDesignEntity)
  async finalizeProductDesign(@Args('id', { type: () => ID }) id: string) {
    return this.productDesignService.finalize(id);
  }

  @Mutation(() => ProductDesignEntity)
  async makeProductDesignPublic(@Args('id', { type: () => ID }) id: string) {
    return this.productDesignService.makePublic(id);
  }

  @Mutation(() => ProductDesignEntity)
  async makeProductDesignTemplate(@Args('id', { type: () => ID }) id: string) {
    return this.productDesignService.makeTemplate(id);
  }
} 