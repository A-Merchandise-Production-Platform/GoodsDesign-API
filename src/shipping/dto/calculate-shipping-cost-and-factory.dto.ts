import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class CalculateShippingCostAndFactoryDto {
  @Field(() => [String])
  @IsArray()
  cartIds: string[];

  @Field(() => String)
  @IsString()
  addressId: string;
} 