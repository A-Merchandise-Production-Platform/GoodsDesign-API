import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { DesignPositionService } from './design-position.service';
import { UpdateDesignPositionDto } from './dto/update-design-position.dto';
import { DesignPositionEntity } from './entities/design-position.entity';

@Resolver(() => DesignPositionEntity)
@UseGuards(GraphqlJwtAuthGuard)
export class DesignPositionResolver {
  constructor(private readonly designPositionService: DesignPositionService) {}

  @Query(() => DesignPositionEntity)
  async designPosition(
    @Args('designId', { type: () => ID }) designId: string,
    @Args('productPositionTypeId', { type: () => ID }) productPositionTypeId: string,
  ) {
    return this.designPositionService.findOne(designId, productPositionTypeId);
  }

  @Mutation(() => DesignPositionEntity)
  async updateDesignPosition(
    @Args('input') input: UpdateDesignPositionDto,
  ) {
    return this.designPositionService.update(input.designId, input.productPositionTypeId, input);
  }

} 