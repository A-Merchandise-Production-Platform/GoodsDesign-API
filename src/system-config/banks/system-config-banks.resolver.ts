import { Query, Resolver } from '@nestjs/graphql';
import { SystemConfigBank } from './models/system-config-bank.model';
import { SystemConfigBanksService } from './system-config-banks.service';

@Resolver(() => SystemConfigBank)
export class SystemConfigBanksResolver {
  constructor(private systemConfigBanksService: SystemConfigBanksService) {}

  @Query(() => [SystemConfigBank], { name: 'systemConfigBanks' })
  async getSystemConfigBanks(): Promise<SystemConfigBank[]> {
    return this.systemConfigBanksService.findAll();
  }
}