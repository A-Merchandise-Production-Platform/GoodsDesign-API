import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductDesignDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  userId?: string;

  @Field(() => String)
  @IsString()
  blankVariantId: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  isFinalized?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  isPublic?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  isTemplate?: boolean;
} 