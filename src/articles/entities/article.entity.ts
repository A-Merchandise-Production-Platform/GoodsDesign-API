import { ApiProperty } from '@nestjs/swagger';

export class Article {
  @ApiProperty({ description: 'The unique identifier of the article' })
  id: number;

  @ApiProperty({ description: 'The title of the article', uniqueItems: true })
  title: string;

  @ApiProperty({ description: 'The description of the article', required: false })
  description?: string;

  @ApiProperty({ description: 'The main content of the article' })
  body: string;

  @ApiProperty({ description: 'Whether the article is published', default: false })
  published: boolean;

  @ApiProperty({ description: 'When the article was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the article was last updated' })
  updatedAt: Date;
}
