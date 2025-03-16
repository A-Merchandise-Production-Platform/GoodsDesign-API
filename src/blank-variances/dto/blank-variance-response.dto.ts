import { Field, ObjectType, Int } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class BlankVarianceResponseDto {
  @Field()
  id: string;

  @Field()
  productId: string;

  @Field(() => GraphQLJSON)
  information: JsonValue;

  @Field(() => Int)
  blankPrice: number;
}