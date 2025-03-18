import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateDesignPositionDto } from './create-design-position.dto';

@InputType()
export class UpdateDesignPositionDto extends PartialType(CreateDesignPositionDto) {
  @Field(() => ID)
  id: string;
} 