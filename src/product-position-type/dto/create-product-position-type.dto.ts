import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductPositionTypeDto {
  @Field()
  productId: string;

  @Field()
  positionName: string;

  @Field(() => Int)
  basePrice: number;
} 