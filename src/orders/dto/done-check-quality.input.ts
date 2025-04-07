import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional, IsArray, Min, IsUUID, ArrayMaxSize, IsNotEmpty } from 'class-validator';

@InputType()
export class DoneCheckQualityInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  checkQualityId: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  passedQuantity: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  failedQuantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  imageUrls?: string[];
} 