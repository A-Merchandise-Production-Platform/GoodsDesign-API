import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticle = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    body: 'Test Body',
    published: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockArticlesService = {
    create: jest.fn().mockResolvedValue(mockArticle),
    findAll: jest.fn().mockResolvedValue([mockArticle]),
    findOne: jest.fn().mockResolvedValue(mockArticle),
    update: jest.fn().mockResolvedValue(mockArticle),
    remove: jest.fn().mockResolvedValue(mockArticle)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService
        }
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body'
      };

      expect(await controller.create(createArticleDto)).toEqual(mockArticle);
      expect(service.create).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      expect(await controller.findAll()).toEqual([mockArticle]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      expect(await controller.findOne('1')).toEqual(mockArticle);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        title: 'Updated Title'
      };

      expect(await controller.update('1', updateArticleDto)).toEqual(mockArticle);
      expect(service.update).toHaveBeenCalledWith(1, updateArticleDto);
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      expect(await controller.remove('1')).toEqual(mockArticle);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
