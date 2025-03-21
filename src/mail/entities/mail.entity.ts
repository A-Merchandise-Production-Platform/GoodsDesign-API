import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Mail {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
