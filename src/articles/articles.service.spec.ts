import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let prisma: PrismaService;

  const mockArticle = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    body: 'Test Body',
    published: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPrismaService = {
    article: {
      create: jest.fn().mockResolvedValue(mockArticle),
      findMany: jest.fn().mockResolvedValue([mockArticle]),
      findUnique: jest.fn().mockResolvedValue(mockArticle),
      update: jest.fn().mockResolvedValue(mockArticle),
      delete: jest.fn().mockResolvedValue(mockArticle)
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body'
      };

      const result = await service.create(createArticleDto);

      expect(result).toEqual(mockArticle);
      expect(prisma.article.create).toHaveBeenCalledWith({
        data: createArticleDto
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockArticle]);
      expect(prisma.article.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockArticle);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should throw NotFoundException when article is not found', async () => {
      jest.spyOn(prisma.article, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title'
      };

      const result = await service.update(1, updateArticleDto);

      expect(result).toEqual(mockArticle);
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateArticleDto
      });
    });

    it('should throw NotFoundException when article to update is not found', async () => {
      jest.spyOn(prisma.article, 'update').mockRejectedValueOnce(new Error('Not found'));

      await expect(service.update(999, { title: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const result = await service.remove(1);

      expect(result).toEqual(mockArticle);
      expect(prisma.article.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should throw NotFoundException when article to remove is not found', async () => {
      jest.spyOn(prisma.article, 'delete').mockRejectedValueOnce(new Error('Not found'));

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
