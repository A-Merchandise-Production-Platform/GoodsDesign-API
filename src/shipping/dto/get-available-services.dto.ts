import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class GetAvailableServicesDto {
  @Field(() => Int)
  @IsNumber()
  fromDistrict: number;

  @Field(() => Int)
  @IsNumber()
  toDistrict: number;
} 