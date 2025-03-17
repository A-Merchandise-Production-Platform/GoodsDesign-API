import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SystemConfigColor } from './models/system-config-color.model';
import { SystemConfigColorsService } from './system-config-colors.service';
import { CreateSystemConfigColorDto, UpdateSystemConfigColorDto } from './dto/system-config-color.dto';

@Resolver(() => SystemConfigColor)
export class SystemConfigColorsResolver {
  constructor(private systemConfigColorsService: SystemConfigColorsService) {}

  @Query(() => [SystemConfigColor], { name: 'systemConfigColors' })
  async getSystemConfigColors(
    @Args('includeDeleted', { type: () => Boolean, nullable: true }) includeDeleted?: boolean,
  ): Promise<SystemConfigColor[]> {
    return this.systemConfigColorsService.findAll(includeDeleted);
  }

  @Query(() => SystemConfigColor, { name: 'systemConfigColor' })
  async getSystemConfigColor(
    @Args('id', { type: () => String }) id: string,
  ): Promise<SystemConfigColor> {
    return this.systemConfigColorsService.findOne(id);
  }

  @Mutation(() => SystemConfigColor)
  async createSystemConfigColor(
    @Args('createSystemConfigColorDto') createSystemConfigColorDto: CreateSystemConfigColorDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigColor> {
    return this.systemConfigColorsService.create(createSystemConfigColorDto, userId);
  }

  @Mutation(() => SystemConfigColor)
  async updateSystemConfigColor(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSystemConfigColorDto') updateSystemConfigColorDto: UpdateSystemConfigColorDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigColor> {
    return this.systemConfigColorsService.update(id, updateSystemConfigColorDto, userId);
  }

  @Mutation(() => SystemConfigColor)
  async removeSystemConfigColor(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigColor> {
    return this.systemConfigColorsService.remove(id, userId);
  }

  @Mutation(() => SystemConfigColor)
  async restoreSystemConfigColor(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigColor> {
    return this.systemConfigColorsService.restore(id, userId);
  }
}