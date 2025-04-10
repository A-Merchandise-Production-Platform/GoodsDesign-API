import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
