import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class MarkAsDelayedDto {
  @Field(() => String, { description: 'The reason for the delay in production' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Delay reason must be at least 10 characters long' })
  delayReason: string;

  @Field(() => Date, { description: 'The new estimated completion date for the delayed order' })
  @IsDate()
  estimatedCompletionDate: Date;
} 