import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateDesignPositionDto {
  @Field()
  designId: string;

  @Field()
  productPositionTypeId: string;

  @Field(() => GraphQLJSON)
  designJSON: JsonValue;
} 