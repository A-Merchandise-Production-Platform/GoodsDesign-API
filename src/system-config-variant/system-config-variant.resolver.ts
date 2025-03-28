import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SystemConfigVariantService } from './system-config-variant.service';
import { SystemConfigVariant } from './entities/system-config-variant.entity';
import { CreateSystemConfigVariantInput } from './dto/create-system-config-variant.input';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { UpdateSystemConfigVariantInput } from './dto/update-system-config-variant.input';

@Resolver(() => SystemConfigVariant)
@UseGuards(GraphqlJwtAuthGuard)
export class SystemConfigVariantResolver {
  constructor(private readonly systemConfigVariantService: SystemConfigVariantService) {}

  @Mutation(() => SystemConfigVariant)
  async createSystemConfigVariant(
    @Args('createSystemConfigVariantInput') createSystemConfigVariantInput: CreateSystemConfigVariantInput,
  ) {
    return this.systemConfigVariantService.create(createSystemConfigVariantInput);
  }

  @Query(() => [SystemConfigVariant], { name: 'systemConfigVariants' })
  async findAll() {
    return this.systemConfigVariantService.findAll();
  }

  @Query(() => SystemConfigVariant, { name: 'systemConfigVariant' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.systemConfigVariantService.findOne(id);
  }

  @Query(() => [SystemConfigVariant], { name: 'systemConfigVariantsByProduct' })
  async findByProduct(@Args('productId', { type: () => String }) productId: string) {
    return this.systemConfigVariantService.findByProduct(productId);
  }

  @Mutation(() => SystemConfigVariant)
  async updateSystemConfigVariant(
    @Args('updateSystemConfigVariantInput') updateSystemConfigVariantInput: UpdateSystemConfigVariantInput,
  ) {
    return this.systemConfigVariantService.update(updateSystemConfigVariantInput.id, updateSystemConfigVariantInput);
  }

  @Mutation(() => SystemConfigVariant)
  async removeSystemConfigVariant(@Args('id', { type: () => String }) id: string) {
    return this.systemConfigVariantService.remove(id);
  }
} 