import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigColorDto {
  @ApiProperty({ description: 'Name of the color' })
  @IsString()
  @Field()
  name: string;

  @ApiProperty({ description: 'Color code (hex format)' })
  @IsString()
  @Field()
  code: string;
}

@InputType()
export class UpdateSystemConfigColorDto {
  @ApiProperty({ description: 'Name of the color' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({ description: 'Color code (hex format)' })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  code?: string;

  @ApiProperty({ description: 'Whether color is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class SystemConfigColorResponseDto {
  @ApiProperty()
  @Field()
  id: string;

  @ApiProperty()
  @Field()
  name: string;

  @ApiProperty()
  @Field()
  code: string;

  @ApiProperty()
  @Field()
  isActive: boolean;

  @ApiProperty()
  @Field()
  isDeleted: boolean;

  @ApiProperty()
  @Field()
  createdAt: Date;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  createdBy?: string;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  updatedBy?: string;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  deletedBy?: string;
}