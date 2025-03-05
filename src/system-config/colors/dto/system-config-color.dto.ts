import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSystemConfigColorDto {
  @ApiProperty({ description: 'Name of the color' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Color code (hex format)' })
  @IsString()
  code: string;
}

export class UpdateSystemConfigColorDto {
  @ApiProperty({ description: 'Name of the color' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Color code (hex format)' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Whether color is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class SystemConfigColorResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  updatedBy?: string;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  @ApiProperty({ required: false })
  deletedBy?: string;
}