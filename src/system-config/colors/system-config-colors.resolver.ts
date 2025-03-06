import { Query, Resolver } from '@nestjs/graphql';
import { SystemConfigColor } from './models/system-config-color.model';
import { SystemConfigColorsService } from './system-config-colors.service';

@Resolver(() => SystemConfigColor)
export class SystemConfigColorsResolver {
  constructor(private systemConfigColorsService: SystemConfigColorsService) {}

  @Query(() => [SystemConfigColor], { name: 'systemConfigColors' })
  async getSystemConfigColors(): Promise<SystemConfigColor[]> {
    return this.systemConfigColorsService.findAll();
  }
}