import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Electronic devices and accessories',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The URL of the category image',
    example: 'https://example.com/images/electronics.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}