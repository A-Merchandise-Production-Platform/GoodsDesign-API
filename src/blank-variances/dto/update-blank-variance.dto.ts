import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateBlankVarianceDto } from './create-blank-variance.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateBlankVarianceDto extends PartialType(CreateBlankVarianceDto) {
  @Field(() => GraphQLJSON, { nullable: true })
  information?: JsonValue;

  @Field(() => Int, { nullable: true })
  blankPrice?: number;
}