import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SystemConfigVariantService } from './system-config-variant.service';
import { CreateSystemConfigVariantInput } from './dto/create-system-config-variant.input';
import { SystemConfigVariant } from './entities/system-config-variant.model';

@Resolver(() => SystemConfigVariant)
export class SystemConfigVariantResolver {
  constructor(private readonly systemConfigVariantService: SystemConfigVariantService) {}

  @Mutation(() => SystemConfigVariant)
  createSystemConfigVariant(@Args('createSystemConfigVariantInput') createSystemConfigVariantInput: CreateSystemConfigVariantInput) {
    return this.systemConfigVariantService.create(createSystemConfigVariantInput);
  }

  @Query(() => [SystemConfigVariant])
  systemConfigVariants() {
    return this.systemConfigVariantService.findAll();
  }

  @Query(() => SystemConfigVariant)
  systemConfigVariant(@Args('id', { type: () => String }) id: string) {
    return this.systemConfigVariantService.findOne(id);
  }

  @Query(() => [SystemConfigVariant])
  systemConfigVariantsByProduct(@Args('productId', { type: () => String }) productId: string) {
    return this.systemConfigVariantService.findByProductId(productId);
  }

  @Mutation(() => SystemConfigVariant)
  updateSystemConfigVariant(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSystemConfigVariantInput') updateSystemConfigVariantInput: CreateSystemConfigVariantInput,
  ) {
    return this.systemConfigVariantService.update(id, updateSystemConfigVariantInput);
  }

  @Mutation(() => SystemConfigVariant)
  removeSystemConfigVariant(@Args('id', { type: () => String }) id: string) {
    return this.systemConfigVariantService.remove(id);
  }
} 