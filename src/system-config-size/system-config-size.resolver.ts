import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SystemConfigSizeService } from './system-config-size.service';
import { SystemConfigSizeEntity } from './entities/system-config-size.entity';
import { CreateSystemConfigSizeDto } from './dto/create-system-config-size.dto';
import { UpdateSystemConfigSizeDto } from './dto/update-system-config-size.dto';

@Resolver(() => SystemConfigSizeEntity)
export class SystemConfigSizeResolver {
  constructor(private readonly systemConfigSizeService: SystemConfigSizeService) {}

  @Mutation(() => SystemConfigSizeEntity)
  async createSystemConfigSize(
    @Args('input') input: CreateSystemConfigSizeDto,
  ) {
    return this.systemConfigSizeService.create(input);
  }

  @Query(() => [SystemConfigSizeEntity])
  async systemConfigSizes() {
    return this.systemConfigSizeService.findAll();
  }

  @Query(() => SystemConfigSizeEntity)
  async systemConfigSize(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigSizeService.findOne(id);
  }

  @Mutation(() => SystemConfigSizeEntity)
  async updateSystemConfigSize(
    @Args('input') input: UpdateSystemConfigSizeDto,
  ) {
    return this.systemConfigSizeService.update(input.id, input);
  }

  @Mutation(() => SystemConfigSizeEntity)
  async removeSystemConfigSize(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigSizeService.remove(id);
  }
} 