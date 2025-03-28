import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariantAttributes {
  @Field(() => [String])
  colors: string[];

  @Field(() => [String])
  sizes: string[];

  @Field(() => [String])
  models: string[];
}