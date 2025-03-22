import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetAvailableServicesDto {
  @Field(() => Int)
  fromDistrict: number;

  @Field(() => Int)
  toDistrict: number;
} 