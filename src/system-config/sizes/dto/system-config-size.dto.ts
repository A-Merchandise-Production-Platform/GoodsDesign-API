import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSystemConfigSizeDto {
  @ApiProperty({ description: 'Size code (e.g., S, M, L)' })
  @IsString()
  code: string;
}

export class UpdateSystemConfigSizeDto {
  @ApiProperty({ description: 'Size code (e.g., S, M, L)' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Whether size is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class SystemConfigSizeResponseDto {
  @ApiProperty()
  id: number;

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