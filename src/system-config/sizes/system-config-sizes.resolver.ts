import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSystemConfigSizeDto, UpdateSystemConfigSizeDto } from './dto/system-config-size.dto';
import { SystemConfigSize } from './models/system-config-size.model';
import { SystemConfigSizesService } from './system-config-sizes.service';

@Resolver(() => SystemConfigSize)
export class SystemConfigSizesResolver {
  constructor(private systemConfigSizesService: SystemConfigSizesService) {}

  @Query(() => [SystemConfigSize], { name: 'systemConfigSizes' })
  async getSystemConfigSizes(
    @Args('includeDeleted', { type: () => Boolean, nullable: true }) includeDeleted?: boolean,
  ): Promise<SystemConfigSize[]> {
    return this.systemConfigSizesService.findAll(includeDeleted);
  }

  @Query(() => SystemConfigSize, { name: 'systemConfigSize' })
  async getSystemConfigSize(
    @Args('id', { type: () => String }) id: string,
  ): Promise<SystemConfigSize> {
    return this.systemConfigSizesService.findOne(id);
  }

  @Mutation(() => SystemConfigSize)
  async createSystemConfigSize(
    @Args('createSystemConfigSizeDto') createSystemConfigSizeDto: CreateSystemConfigSizeDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigSize> {
    return this.systemConfigSizesService.create(createSystemConfigSizeDto, userId);
  }

  @Mutation(() => SystemConfigSize)
  async updateSystemConfigSize(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSystemConfigSizeDto') updateSystemConfigSizeDto: UpdateSystemConfigSizeDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigSize> {
    return this.systemConfigSizesService.update(id, updateSystemConfigSizeDto, userId);
  }

  @Mutation(() => SystemConfigSize)
  async removeSystemConfigSize(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigSize> {
    return this.systemConfigSizesService.remove(id, userId);
  }

  @Mutation(() => SystemConfigSize)
  async restoreSystemConfigSize(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigSize> {
    return this.systemConfigSizesService.restore(id, userId);
  }
}