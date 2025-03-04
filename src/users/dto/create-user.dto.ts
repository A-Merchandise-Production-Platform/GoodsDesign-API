import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User gender', example: false })
  @IsBoolean()
  gender: boolean;

  @ApiProperty({ description: 'User date of birth', required: false, example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ description: 'User image URL', required: false, example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'User role', enum: Roles, example: 'CUSTOMER' })
  @IsEnum(Roles)
  role: Roles;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @IsString()
  @IsOptional()
  createdBy?: string;
}