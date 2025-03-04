import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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