// src/articles/articles.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async findAll() {
    return this.prisma.article.findMany();
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      return await this.prisma.article.update({
        where: { id },
        data: updateArticleDto,
      });
    } catch (error) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.article.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }
}

