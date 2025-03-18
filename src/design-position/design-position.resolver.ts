import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DesignPositionService } from './design-position.service';
import { DesignPositionEntity } from './entities/design-position.entity';
import { CreateDesignPositionDto } from './dto/create-design-position.dto';
import { UpdateDesignPositionDto } from './dto/update-design-position.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';

@Resolver(() => DesignPositionEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class DesignPositionResolver {
  constructor(private readonly designPositionService: DesignPositionService) {}

  @Mutation(() => DesignPositionEntity)
  async createDesignPosition(
    @Args('input') input: CreateDesignPositionDto,
  ) {
    return this.designPositionService.create(input);
  }

  @Query(() => [DesignPositionEntity])
  async designPositions(
    @Args('designId') designId: string,
  ) {
    return this.designPositionService.findAll(designId);
  }

  @Query(() => DesignPositionEntity)
  async designPosition(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.designPositionService.findOne(id);
  }

  @Mutation(() => DesignPositionEntity)
  async updateDesignPosition(
    @Args('input') input: UpdateDesignPositionDto,
  ) {
    return this.designPositionService.update(input.id, input);
  }

  @Mutation(() => DesignPositionEntity)
  async removeDesignPosition(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.designPositionService.remove(id);
  }
} 