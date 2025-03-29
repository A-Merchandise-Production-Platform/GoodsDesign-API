import { Field, ID, InputType } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateDesignPositionDto {
  @Field()
  designId: string;

  @Field()
  productPositionTypeId: string;

  @Field(() => GraphQLJSON, { nullable: true })
  designJSON?: JsonValue;
} 