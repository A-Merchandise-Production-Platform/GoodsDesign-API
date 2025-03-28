import { CreateSystemConfigVariantInput } from './create-system-config-variant.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateSystemConfigVariantInput extends PartialType(CreateSystemConfigVariantInput) {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 