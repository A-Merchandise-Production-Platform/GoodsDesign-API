import { Test, TestingModule } from '@nestjs/testing';
import { SystemConfigBanksController } from './system-config-banks.controller';
import { SystemConfigBanksService } from './system-config-banks.service';
import { CreateSystemConfigBankDto, UpdateSystemConfigBankDto } from './dto/system-config-bank.dto';

describe('SystemConfigBanksController', () => {
  let controller: SystemConfigBanksController;
  let service: SystemConfigBanksService;

  const mockBank = {
    id: 1,
    name: 'Test Bank',
    code: 'TST',
    bin: '123456',
    shortName: 'TestBank',
    logo: 'https://test.com/logo.png',
    transferSupported: true,
    lookupSupported: true,
    support: 1,
    isTransfer: true,
    swiftCode: 'TESTCODE',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    createdBy: 'test-user',
    updatedAt: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockSystemConfigBanksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemConfigBanksController],
      providers: [
        {
          provide: SystemConfigBanksService,
          useValue: mockSystemConfigBanksService,
        },
      ],
    }).compile();

    controller = module.get<SystemConfigBanksController>(SystemConfigBanksController);
    service = module.get<SystemConfigBanksService>(SystemConfigBanksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new bank', async () => {
      const createDto: CreateSystemConfigBankDto = {
        name: 'Test Bank',
        code: 'TST',
        bin: '123456',
        shortName: 'TestBank',
        logo: 'https://test.com/logo.png',
        transferSupported: true,
        lookupSupported: true,
        support: 1,
        isTransfer: true,
        swiftCode: 'TESTCODE',
      };

      mockSystemConfigBanksService.create.mockResolvedValue(mockBank);

      const result = await controller.create(createDto, 'test-user');
      expect(result).toEqual(mockBank);
      expect(mockSystemConfigBanksService.create).toHaveBeenCalledWith(createDto, 'test-user');
    });
  });

  describe('findAll', () => {
    it('should return all banks', async () => {
      mockSystemConfigBanksService.findAll.mockResolvedValue([mockBank]);

      const result = await controller.findAll(false);
      expect(result).toEqual([mockBank]);
      expect(mockSystemConfigBanksService.findAll).toHaveBeenCalledWith(false);
    });
  });

  describe('findOne', () => {
    it('should return a bank by id', async () => {
      mockSystemConfigBanksService.findOne.mockResolvedValue(mockBank);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockBank);
      expect(mockSystemConfigBanksService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a bank', async () => {
      const updateDto: UpdateSystemConfigBankDto = {
        name: 'Updated Bank',
      };

      const updatedBank = { ...mockBank, name: 'Updated Bank' };
      mockSystemConfigBanksService.update.mockResolvedValue(updatedBank);

      const result = await controller.update(1, updateDto, 'test-user');
      expect(result).toEqual(updatedBank);
      expect(mockSystemConfigBanksService.update).toHaveBeenCalledWith(1, updateDto, 'test-user');
    });
  });

  describe('remove', () => {
    it('should remove a bank', async () => {
      const deletedBank = { ...mockBank, isDeleted: true };
      mockSystemConfigBanksService.remove.mockResolvedValue(deletedBank);

      const result = await controller.remove(1, 'test-user');
      expect(result).toEqual(deletedBank);
      expect(mockSystemConfigBanksService.remove).toHaveBeenCalledWith(1, 'test-user');
    });
  });

  describe('restore', () => {
    it('should restore a bank', async () => {
      mockSystemConfigBanksService.restore.mockResolvedValue(mockBank);

      const result = await controller.restore(1, 'test-user');
      expect(result).toEqual(mockBank);
      expect(mockSystemConfigBanksService.restore).toHaveBeenCalledWith(1, 'test-user');
    });
  });
});