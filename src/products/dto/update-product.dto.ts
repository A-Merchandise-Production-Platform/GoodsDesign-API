import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Modern Chair',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A comfortable modern chair with ergonomic design',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The URL of the product image',
    example: 'https://example.com/images/modern-chair.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'The URL of the 3D model',
    example: 'https://example.com/models/modern-chair.glb',
    required: false,
  })
  @IsOptional()
  @IsString()
  model3DUrl?: string;

  @ApiProperty({
    description: 'The ID of the category this product belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}