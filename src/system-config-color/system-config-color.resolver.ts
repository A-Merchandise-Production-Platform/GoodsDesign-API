import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SystemConfigColorService } from './system-config-color.service';
import { SystemConfigColorEntity } from './entities/system-config-color.entity';
import { CreateSystemConfigColorDto } from './dto/create-system-config-color.dto';
import { UpdateSystemConfigColorDto } from './dto/update-system-config-color.dto';

@Resolver(() => SystemConfigColorEntity)
export class SystemConfigColorResolver {
  constructor(private readonly systemConfigColorService: SystemConfigColorService) {}

  @Mutation(() => SystemConfigColorEntity)
  async createSystemConfigColor(
    @Args('input') input: CreateSystemConfigColorDto,
  ) {
    return this.systemConfigColorService.create(input);
  }

  @Query(() => [SystemConfigColorEntity])
  async systemConfigColors() {
    return this.systemConfigColorService.findAll();
  }

  @Query(() => SystemConfigColorEntity)
  async systemConfigColor(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigColorService.findOne(id);
  }

  @Mutation(() => SystemConfigColorEntity)
  async updateSystemConfigColor(
    @Args('input') input: UpdateSystemConfigColorDto,
  ) {
    return this.systemConfigColorService.update(input.id, input);
  }

  @Mutation(() => SystemConfigColorEntity)
  async removeSystemConfigColor(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigColorService.remove(id);
  }
} 