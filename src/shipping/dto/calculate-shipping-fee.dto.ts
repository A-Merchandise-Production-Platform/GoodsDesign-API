import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CalculateShippingFeeDto {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  serviceId?: number;

  @Field(() => Int, { nullable: true, defaultValue: 2 })
  @IsNumber()
  @IsOptional()
  serviceTypeId?: number;

  @Field(() => Int)
  @IsNumber()
  fromDistrictId?: number;

  @Field(() => String)
  @IsString()
  fromWardCode?: string;

  @Field(() => Int)
  @IsNumber()
  toDistrictId?: number;

  @Field(() => String)
  @IsString()
  toWardCode?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1000 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  length?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  width?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  height?: number;
} 