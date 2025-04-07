import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DoneCheckQualityInput {
  @Field()
  checkQualityId: string;

  @Field(() => Int)
  passedQuantity: number;

  @Field(() => Int)
  failedQuantity: number;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [String], { nullable: true })
  imageUrls?: string[];
} 