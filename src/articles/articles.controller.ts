import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: Article
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: 200,
    description: 'List of all articles',
    type: [Article]
  })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiParam({ name: 'id', description: 'The ID of the article' })
  @ApiResponse({
    status: 200,
    description: 'The found article',
    type: Article
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found'
  })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article by id' })
  @ApiParam({ name: 'id', description: 'The ID of the article to update' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated',
    type: Article
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found'
  })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article by id' })
  @ApiParam({ name: 'id', description: 'The ID of the article to delete' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully deleted',
    type: Article
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found'
  })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
