import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['createdBy'] as const)) {
  @ApiProperty({ description: 'Updated by user ID', required: false })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}