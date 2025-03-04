import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Electronic devices and accessories',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    description: 'The URL of the category image',
    example: 'https://example.com/images/electronics.jpg',
    required: false,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the category has been deleted',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'The date and time when the category was created',
    example: '2024-03-05T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The ID of the user who created the category',
    example: 'user123',
    required: false,
  })
  createdBy: string | null;

  @ApiProperty({
    description: 'The date and time when the category was last updated',
    example: '2024-03-05T00:00:00.000Z',
    required: false,
  })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'The ID of the user who last updated the category',
    example: 'user123',
    required: false,
  })
  updatedBy: string | null;
}