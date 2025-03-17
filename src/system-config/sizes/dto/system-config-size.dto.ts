import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigSizeDto {
  @ApiProperty({ description: 'Size code (e.g., S, M, L)' })
  @IsString()
  @Field()
  code: string;
  @ApiProperty({ description: 'Whether size is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateSystemConfigSizeDto {
  @ApiProperty({ description: 'Size code (e.g., S, M, L)' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  code?: string;

  @ApiProperty({ description: 'Whether size is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class SystemConfigSizeResponseDto {
  @ApiProperty()
  @Field()
  id: string;

  @ApiProperty()
  @Field()
  code: string;

  @ApiProperty()
  @Field()
  isActive: boolean;

  @ApiProperty()
  @Field()
  isDeleted: boolean;
}