import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateProductPositionTypeDto } from './create-product-position-type.dto';

@InputType()
export class UpdateProductPositionTypeDto extends PartialType(CreateProductPositionTypeDto) {
  @Field(() => ID)
  id: string;
} 