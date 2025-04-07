import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class FeedbackOrderInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ratingComment?: string;
} 