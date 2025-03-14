import { Field, InputType, Int } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateBlankVarianceDto {
  @Field()
  productId: string;

  @Field(() => GraphQLJSON)
  information: JsonValue;

  @Field(() => Int)
  blankPrice: number;
}