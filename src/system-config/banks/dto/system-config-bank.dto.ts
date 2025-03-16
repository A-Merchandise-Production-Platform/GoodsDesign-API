import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSystemConfigBankDto {
  @ApiProperty({ description: 'Name of the bank' })
  @IsString()
  @Field()
  name: string;

  @ApiProperty({ description: 'Bank code' })
  @IsString()
  @Field()
  code: string;

  @ApiProperty({ description: 'Bank Identification Number' })
  @IsString()
  @Field()
  bin: string;

  @ApiProperty({ description: 'Short name of the bank' })
  @IsString()
  @Field()
  shortName: string;

  @ApiProperty({ description: 'Logo URL of the bank' })
  @IsString()
  @Field()
  logo: string;

  @ApiProperty({ description: 'Whether bank supports transfers', default: false })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  transferSupported?: boolean;

  @ApiProperty({ description: 'Whether bank supports lookups', default: false })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  lookupSupported?: boolean;

  @ApiProperty({ description: 'Support level', default: 0 })
  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  support?: number;

  @ApiProperty({ description: 'Whether bank is transfer enabled', default: false })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isTransfer?: boolean;

  @ApiProperty({ description: 'SWIFT code of the bank', required: false })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  swiftCode?: string;
}

@InputType()
export class UpdateSystemConfigBankDto extends CreateSystemConfigBankDto {
  @ApiProperty({ description: 'Whether bank is active', default: true })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class SystemConfigBankResponseDto {
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
  bin: string;

  @ApiProperty()
  @Field()
  shortName: string;

  @ApiProperty()
  @Field()
  logo: string;

  @ApiProperty()
  @Field()
  transferSupported: boolean;

  @ApiProperty()
  @Field()
  lookupSupported: boolean;

  @ApiProperty()
  @Field()
  support: number;

  @ApiProperty()
  @Field()
  isTransfer: boolean;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  swiftCode?: string;

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