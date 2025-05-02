import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShippingService } from '../shipping/shipping.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../users';
import { AddressEntity } from './entities/address.entity';
import { FactoryEntity } from '../factory/entities/factory.entity';

describe('AddressesService', () => {
  let service: AddressesService;
  let prismaService: PrismaService;
  let shippingService: ShippingService;

  const mockPrismaService = {
    address: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockShippingService = {
    getProvince: jest.fn(),
    getDistrict: jest.fn(),
    getWard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ShippingService,
          useValue: mockShippingService,
        },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    prismaService = module.get<PrismaService>(PrismaService);
    shippingService = module.get<ShippingService>(ShippingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAddress', () => {
    it('should create a new address', async () => {
      const user = new UserEntity({ id: '1' });
      const createAddressInput = {
        street: '123 Test Street',
        provinceID: 1,
        districtID: 1,
        wardCode: '12345',
        factoryId: '1',
      };

      const mockAddress = {
        id: '1',
        ...createAddressInput,
        userId: user.id,
        factory: { id: '1', name: 'Test Factory' },
        user: { id: '1', name: 'Test User' },
      };

      mockPrismaService.address.create.mockResolvedValue(mockAddress);

      const result = await service.createAddress(createAddressInput, user);
      expect(result).toBeInstanceOf(AddressEntity);
      expect(result.id).toBe('1');
      expect(result.factory).toBeInstanceOf(FactoryEntity);
    });

    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.createAddress({} as any, null)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAddresses', () => {
    it('should return all addresses for a user', async () => {
      const user = new UserEntity({ id: '1' });
      const mockAddresses = [
        {
          id: '1',
          street: '123 Test Street',
          userId: user.id,
          factory: { id: '1', name: 'Test Factory' },
          user: { id: '1', name: 'Test User' },
        },
        {
          id: '2',
          street: '456 Test Street',
          userId: user.id,
          factory: null,
          user: { id: '1', name: 'Test User' },
        },
      ];

      mockPrismaService.address.findMany.mockResolvedValue(mockAddresses);

      const result = await service.getAddresses(user);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(AddressEntity);
      expect(result[1]).toBeInstanceOf(AddressEntity);
    });

    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.getAddresses(null)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAddress', () => {
    it('should return a specific address', async () => {
      const user = new UserEntity({ id: '1' });
      const addressId = '1';
      const mockAddress = {
        id: addressId,
        street: '123 Test Street',
        userId: user.id,
        factory: { id: '1', name: 'Test Factory' },
        user: { id: '1', name: 'Test User' },
      };

      mockPrismaService.address.findUnique.mockResolvedValue(mockAddress);

      const result = await service.getAddress(addressId, user);
      expect(result).toBeInstanceOf(AddressEntity);
      expect(result.id).toBe(addressId);
    });

    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.getAddress('1', null)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateAddress', () => {
    it('should update an address', async () => {
      const user = new UserEntity({ id: '1' });
      const addressId = '1';
      const updateAddressInput = {
        street: 'Updated Street',
        provinceID: 2,
        districtID: 2,
        wardCode: '54321',
      };

      const mockAddress = {
        id: addressId,
        ...updateAddressInput,
        userId: user.id,
        factory: { id: '1', name: 'Test Factory' },
        user: { id: '1', name: 'Test User' },
      };

      mockPrismaService.address.update.mockResolvedValue(mockAddress);

      const result = await service.updateAddress(addressId, updateAddressInput, user);
      expect(result).toBeInstanceOf(AddressEntity);
      expect(result.street).toBe(updateAddressInput.street);
    });

    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.updateAddress('1', {} as any, null)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteAddress', () => {
    it('should delete an address', async () => {
      const user = new UserEntity({ id: '1' });
      const addressId = '1';
      const mockAddress = {
        id: addressId,
        street: '123 Test Street',
        userId: user.id,
        factory: { id: '1', name: 'Test Factory' },
        user: { id: '1', name: 'Test User' },
      };

      mockPrismaService.address.delete.mockResolvedValue(mockAddress);

      const result = await service.deleteAddress(addressId, user);
      expect(result).toBeInstanceOf(AddressEntity);
      expect(result.id).toBe(addressId);
    });

    it('should throw UnauthorizedException if user is not provided', async () => {
      await expect(service.deleteAddress('1', null)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('formatAddress', () => {
    it('should format an address correctly', async () => {
      const formatAddressInput = {
        street: '123 Test Street',
        provinceID: 1,
        districtID: 1,
        wardCode: '12345',
      };

      mockShippingService.getProvince.mockResolvedValue({ provinceName: 'Test Province' });
      mockShippingService.getDistrict.mockResolvedValue({ districtName: 'Test District' });
      mockShippingService.getWard.mockResolvedValue({ wardName: 'Test Ward' });

      const result = await service.formatAddress(formatAddressInput);
      expect(result).toEqual({
        text: '123 Test Street, Test Ward, Test District, Test Province',
      });
    });

    it('should throw NotFoundException if address formatting fails', async () => {
      const formatAddressInput = {
        street: '123 Test Street',
        provinceID: 1,
        districtID: 1,
        wardCode: '12345',
      };

      mockShippingService.getProvince.mockRejectedValue(new Error('Province not found'));

      await expect(service.formatAddress(formatAddressInput)).rejects.toThrow(NotFoundException);
    });
  });
}); 