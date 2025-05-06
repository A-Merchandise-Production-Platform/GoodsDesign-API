import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateSystemConfigVariantInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  size?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  model?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;
} 