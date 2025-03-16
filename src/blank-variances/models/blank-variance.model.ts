import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class BlankVariance {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field(() => GraphQLJSON)
  information: JsonValue;

  @Field(() => Int)
  blankPrice: number;
}