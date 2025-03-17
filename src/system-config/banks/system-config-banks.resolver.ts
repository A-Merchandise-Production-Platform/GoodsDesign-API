import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SystemConfigBank } from './models/system-config-bank.model';
import { SystemConfigBanksService } from './system-config-banks.service';
import { CreateSystemConfigBankDto, UpdateSystemConfigBankDto } from './dto/system-config-bank.dto';

@Resolver(() => SystemConfigBank)
export class SystemConfigBanksResolver {
  constructor(private systemConfigBanksService: SystemConfigBanksService) {}

  @Query(() => [SystemConfigBank], { name: 'systemConfigBanks' })
  async getSystemConfigBanks(
    @Args('includeDeleted', { type: () => Boolean, nullable: true }) includeDeleted?: boolean,
  ): Promise<SystemConfigBank[]> {
    return this.systemConfigBanksService.findAll(includeDeleted);
  }

  @Query(() => SystemConfigBank, { name: 'systemConfigBank' })
  async getSystemConfigBank(
    @Args('id', { type: () => String }) id: string,
  ): Promise<SystemConfigBank> {
    return this.systemConfigBanksService.findOne(id);
  }

  @Mutation(() => SystemConfigBank)
  async createSystemConfigBank(
    @Args('createSystemConfigBankDto') createSystemConfigBankDto: CreateSystemConfigBankDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigBank> {
    return this.systemConfigBanksService.create(createSystemConfigBankDto, userId);
  }

  @Mutation(() => SystemConfigBank)
  async updateSystemConfigBank(
    @Args('id', { type: () => String }) id: string,
    @Args('updateSystemConfigBankDto') updateSystemConfigBankDto: UpdateSystemConfigBankDto,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigBank> {
    return this.systemConfigBanksService.update(id, updateSystemConfigBankDto, userId);
  }

  @Mutation(() => SystemConfigBank)
  async removeSystemConfigBank(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigBank> {
    return this.systemConfigBanksService.remove(id, userId);
  }

  @Mutation(() => SystemConfigBank)
  async restoreSystemConfigBank(
    @Args('id', { type: () => String }) id: string,
    @Args('userId', { type: () => String, nullable: true }) userId?: string,
  ): Promise<SystemConfigBank> {
    return this.systemConfigBanksService.restore(id, userId);
  }
}