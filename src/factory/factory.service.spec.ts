import { Test, TestingModule } from '@nestjs/testing';
import { FactoryService } from './factory.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AddressesService } from '../addresses/addresses.service';
import { FactoryProductsService } from '../factory-products/factory-products.service';
import { MailService } from '../mail';
import { FactoryStatus, Roles } from '@prisma/client';
import { FactoryEntity } from './entities/factory.entity';
import { UserEntity } from '../users/entities/users.entity';
import { AddressEntity } from '../addresses/entities/address.entity';
import { FactoryProductEntity } from '../factory-products/entities/factory-product.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('FactoryService', () => {
  let service: FactoryService;
  let prismaService: PrismaService;
  let notificationsService: NotificationsService;
  let addressesService: AddressesService;
  let factoryProductsService: FactoryProductsService;
  let mailService: MailService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    phoneNumber: '1234567890',
    password: 'hashedPassword',
    gender: false,
    dateOfBirth: new Date(),
    imageUrl: 'test.jpg',
    role: Roles.FACTORYOWNER,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockStaff = {
    id: '2',
    name: 'Staff User',
    email: 'staff@test.com',
    phoneNumber: '0987654321',
    password: 'hashedPassword',
    gender: false,
    dateOfBirth: new Date(),
    imageUrl: 'staff.jpg',
    role: Roles.STAFF,
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  };

  const mockAddress = {
    id: '1',
    street: 'Test Street',
    wardCode: '123',
    districtID: 1,
    provinceID: 1,
    userId: '1',
    factoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFactory = {
    factoryOwnerId: '1',
    name: 'Test Factory',
    description: 'Test Description',
    businessLicenseUrl: 'test-url',
    taxIdentificationNumber: '123456789',
    addressId: '1',
    website: 'test.com',
    establishedDate: new Date(),
    factoryStatus: FactoryStatus.PENDING_APPROVAL,
    maxPrintingCapacity: 1000,
    qualityCertifications: 'ISO9001',
    printingMethods: ['DIGITAL', 'SCREEN'],
    specializations: ['TSHIRT', 'HOODIE'],
    contactPersonName: 'John Doe',
    contactPersonRole: 'Manager',
    contactPhone: '1234567890',
    contactPersonPhone: '1234567890',
    leadTime: 5,
    isSubmitted: true,
    legitPoint: 100,
    statusNote: '',
    contractAccepted: false,
    contractAcceptedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    contractUrl: null,
    staffId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    address: mockAddress,
    owner: mockUser,
    staff: mockStaff,
    products: [],
    orders: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        {
          provide: PrismaService,
          useValue: {
            factory: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              upsert: jest.fn(),
              update: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AddressesService,
          useValue: {
            formatAddress: jest.fn(),
          },
        },
        {
          provide: FactoryProductsService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendFactoryRegistrationEmail: jest.fn(),
            sendFactoryStatusUpdateEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FactoryService>(FactoryService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    addressesService = module.get<AddressesService>(AddressesService);
    factoryProductsService = module.get<FactoryProductsService>(FactoryProductsService);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFactories', () => {
    it('should return all factories with formatted addresses', async () => {
      const formattedAddress = 'Test Street, Ward 1, District 1, Province 1';
      jest.spyOn(prismaService.factory, 'findMany').mockResolvedValue([mockFactory]);
      jest.spyOn(addressesService, 'formatAddress').mockResolvedValue({ text: formattedAddress });

      const result = await service.getAllFactories();

      expect(prismaService.factory.findMany).toHaveBeenCalledWith({
        include: {
          address: true,
          products: true,
          orders: true,
          owner: true,
          staff: true,
        },
      });
      expect(result).toEqual([
        new FactoryEntity({
          ...mockFactory,
          formattedAddress,
        }),
      ]);
    });

    it('should throw NotFoundException when no factories found', async () => {
      jest.spyOn(prismaService.factory, 'findMany').mockResolvedValue(null);

      await expect(service.getAllFactories()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFactoryById', () => {
    it('should return a factory by id with formatted address', async () => {
      const formattedAddress = 'Test Street, Ward 1, District 1, Province 1';
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(mockFactory);
      jest.spyOn(addressesService, 'formatAddress').mockResolvedValue({ text: formattedAddress });

      const result = await service.getFactoryById('1');

      expect(prismaService.factory.findUnique).toHaveBeenCalledWith({
        where: { factoryOwnerId: '1' },
        include: {
          address: true,
          products: {
            include: {
              systemConfigVariant: true,
            },
          },
          orders: true,
          owner: true,
          staff: true,
        },
      });
      expect(result).toEqual(
        new FactoryEntity({
          ...mockFactory,
          formattedAddress,
        }),
      );
    });

    it('should throw NotFoundException when factory not found', async () => {
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(null);

      await expect(service.getFactoryById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyFactory', () => {
    it('should return user\'s factory with formatted address', async () => {
      const formattedAddress = 'Test Street, Ward 1, District 1, Province 1';
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(mockFactory);
      jest.spyOn(addressesService, 'formatAddress').mockResolvedValue({ text: formattedAddress });

      const result = await service.getMyFactory('1');

      expect(prismaService.factory.findUnique).toHaveBeenCalledWith({
        where: { factoryOwnerId: '1' },
        include: {
          address: true,
          products: true,
          orders: true,
          owner: true,
          staff: true,
        },
      });
      expect(result).toEqual(
        new FactoryEntity({
          ...mockFactory,
          formattedAddress,
          address: new AddressEntity(mockFactory.address),
          products: [],
          owner: new UserEntity(mockFactory.owner),
          staff: new UserEntity(mockFactory.staff),
        }),
      );
    });

    it('should return null when factory not found', async () => {
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(null);

      const result = await service.getMyFactory('1');

      expect(result).toBeNull();
    });

    it('should throw BadRequestException when userId is not provided', async () => {
      await expect(service.getMyFactory(null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('assignStaffToFactory', () => {
    const adminUser = { ...mockUser, role: Roles.ADMIN };

    it('should assign staff to factory', async () => {
      const mockStaffWithoutFactory = { ...mockStaff };
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(mockFactory);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockStaffWithoutFactory);
      jest.spyOn(prismaService.factory, 'update').mockResolvedValue(mockFactory);
      jest.spyOn(addressesService, 'formatAddress').mockResolvedValue({ text: 'formatted address' });

      const result = await service.assignStaffToFactory('1', '2', adminUser);

      expect(prismaService.factory.update).toHaveBeenCalledWith({
        where: { factoryOwnerId: '1' },
        data: { staffId: '2' },
      });
      expect(result).toBeInstanceOf(FactoryEntity);
    });

    it('should throw ForbiddenException when user is not admin or manager', async () => {
      await expect(service.assignStaffToFactory('1', '2', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when factory not found', async () => {
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(null);

      await expect(service.assignStaffToFactory('1', '2', adminUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when staff not found', async () => {
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(mockFactory);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.assignStaffToFactory('1', '2', adminUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when staff already assigned to a factory', async () => {
      const mockStaffWithFactory = {
        ...mockStaff,
        staffedFactory: () => ({
          factoryOwnerId: '3',
          name: 'Another Factory',
        }),
      };
      jest.spyOn(prismaService.factory, 'findUnique').mockResolvedValue(mockFactory);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockStaffWithFactory);

      await expect(service.assignStaffToFactory('1', '2', adminUser)).rejects.toThrow(BadRequestException);
    });
  });
}); 