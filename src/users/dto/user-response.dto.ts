import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User gender' })
  gender: boolean;

  @ApiProperty({ description: 'User date of birth' })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'User image URL' })
  imageUrl?: string;

  @ApiProperty({ description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ description: 'User deletion status' })
  isDeleted: boolean;

  @ApiProperty({ description: 'User role' })
  role: Roles;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Created by user ID' })
  createdBy?: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt?: Date;

  @ApiProperty({ description: 'Updated by user ID' })
  updatedBy?: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  deletedBy?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}