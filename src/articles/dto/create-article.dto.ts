import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'My First Article'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'A brief description of the article',
    required: false,
    example: 'An interesting article about...'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The main content of the article',
    example: 'Lorem ipsum dolor sit amet...'
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Whether the article is published',
    required: false,
    default: false,
    example: true
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
