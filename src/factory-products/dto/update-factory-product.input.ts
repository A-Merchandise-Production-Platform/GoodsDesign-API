import { CreateFactoryProductInput } from './create-factory-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFactoryProductInput extends PartialType(CreateFactoryProductInput) {
  @Field(() => Int)
  id: number;
}
