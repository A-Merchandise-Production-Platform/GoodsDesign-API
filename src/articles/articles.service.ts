// src/articles/articles.service.ts

import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}

