import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSystemConfigBankDto {
  @ApiProperty({ description: 'Name of the bank' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Bank code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Bank Identification Number' })
  @IsString()
  bin: string;

  @ApiProperty({ description: 'Short name of the bank' })
  @IsString()
  shortName: string;

  @ApiProperty({ description: 'Logo URL of the bank' })
  @IsString()
  logo: string;

  @ApiProperty({ description: 'Whether bank supports transfers', default: false })
  @IsBoolean()
  @IsOptional()
  transferSupported?: boolean;

  @ApiProperty({ description: 'Whether bank supports lookups', default: false })
  @IsBoolean()
  @IsOptional()
  lookupSupported?: boolean;

  @ApiProperty({ description: 'Support level', default: 0 })
  @IsNumber()
  @IsOptional()
  support?: number;

  @ApiProperty({ description: 'Whether bank is transfer enabled', default: false })
  @IsBoolean()
  @IsOptional()
  isTransfer?: boolean;

  @ApiProperty({ description: 'SWIFT code of the bank', required: false })
  @IsString()
  @IsOptional()
  swiftCode?: string;
}

export class UpdateSystemConfigBankDto extends CreateSystemConfigBankDto {
  @ApiProperty({ description: 'Whether bank is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class SystemConfigBankResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  bin: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  transferSupported: boolean;

  @ApiProperty()
  lookupSupported: boolean;

  @ApiProperty()
  support: number;

  @ApiProperty()
  isTransfer: boolean;

  @ApiProperty({ required: false })
  swiftCode?: string;

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