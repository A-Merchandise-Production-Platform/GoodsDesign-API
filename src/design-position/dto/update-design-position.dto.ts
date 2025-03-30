import { Field, ID, InputType } from '@nestjs/graphql';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdateDesignPositionDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  designId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productPositionTypeId: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  designJSON?: JsonValue;
} 