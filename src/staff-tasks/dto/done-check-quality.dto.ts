import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class DoneCheckQualityDto {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  passedQuantity: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  failedQuantity: number;

  @Field(() => Boolean)
  @IsBoolean()
  reworkRequired: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
} 