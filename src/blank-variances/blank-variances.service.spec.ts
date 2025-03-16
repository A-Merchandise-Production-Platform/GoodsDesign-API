import { Test, TestingModule } from '@nestjs/testing';
import { BlankVariancesService } from './blank-variances.service';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';

describe('BlankVariancesService', () => {
  let service: BlankVariancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlankVariancesService, PrismaService],
    }).compile();

    service = module.get<BlankVariancesService>(BlankVariancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a blank variance', async () => {
    const blankVariance = { id: '1', productId: '1', information: {}, blankPrice: new Decimal(100), product: { connect: { id: '1' } } };
    jest.spyOn(service, 'create').mockResolvedValue(blankVariance);

    expect(await service.create(blankVariance)).toBe(blankVariance);
  });

  it('should return all blank variances', async () => {
    const blankVariances = [{ id: '1', productId: '1', information: {}, blankPrice: new Decimal(100) }];
    jest.spyOn(service, 'findAll').mockResolvedValue(blankVariances);

    expect(await service.findAll()).toBe(blankVariances);
  });

  it('should return a blank variance by ID', async () => {
    const blankVariance = { id: '1', productId: '1', information: {}, blankPrice: new Decimal(100) };
    jest.spyOn(service, 'findOne').mockResolvedValue(blankVariance);

    expect(await service.findOne('1')).toBe(blankVariance);
  });

  it('should update a blank variance by ID', async () => {
    const blankVariance = { id: '1', productId: '1', information: {}, blankPrice: new Decimal(100) };
    jest.spyOn(service, 'update').mockResolvedValue(blankVariance);

    expect(await service.update('1', blankVariance)).toBe(blankVariance);
  });

  it('should delete a blank variance by ID', async () => {
    const blankVariance = { id: '1', productId: '1', information: {}, blankPrice: new Decimal(100) };
    jest.spyOn(service, 'remove').mockResolvedValue(blankVariance);

    expect(await service.remove('1')).toBe(blankVariance);
  });
});