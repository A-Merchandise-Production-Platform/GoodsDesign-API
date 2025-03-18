import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SystemConfigBankService } from './system-config-bank.service';
import { SystemConfigBankEntity } from './entities/system-config-bank.entity';
import { CreateSystemConfigBankDto } from './dto/create-system-config-bank.dto';
import { UpdateSystemConfigBankDto } from './dto/update-system-config-bank.dto';

@Resolver(() => SystemConfigBankEntity)
export class SystemConfigBankResolver {
  constructor(private readonly systemConfigBankService: SystemConfigBankService) {}

  @Mutation(() => SystemConfigBankEntity)
  async createSystemConfigBank(
    @Args('input') input: CreateSystemConfigBankDto,
  ) {
    return this.systemConfigBankService.create(input);
  }

  @Query(() => [SystemConfigBankEntity])
  async systemConfigBanks() {
    return this.systemConfigBankService.findAll();
  }

  @Query(() => SystemConfigBankEntity)
  async systemConfigBank(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigBankService.findOne(id);
  }

  @Mutation(() => SystemConfigBankEntity)
  async updateSystemConfigBank(
    @Args('input') input: UpdateSystemConfigBankDto,
  ) {
    return this.systemConfigBankService.update(input.id, input);
  }

  @Mutation(() => SystemConfigBankEntity)
  async removeSystemConfigBank(
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.systemConfigBankService.remove(id);
  }
} 