import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Prisma } from '@prisma/client';

@InputType()
export class CreateSystemConfigVariantInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsArray()
  @IsNotEmpty()
  value: Prisma.InputJsonValue;

  @Field()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 