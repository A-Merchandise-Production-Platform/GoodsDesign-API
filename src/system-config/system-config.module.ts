import { Module } from '@nestjs/common';
import { SystemConfigBanksModule } from './banks';
import { SystemConfigColorsModule } from './colors';
import { SystemConfigSizesModule } from './sizes';

@Module({
  imports: [
    SystemConfigBanksModule,
    SystemConfigColorsModule,
    SystemConfigSizesModule,
  ],
  exports: [
    SystemConfigBanksModule,
    SystemConfigColorsModule,
    SystemConfigSizesModule,
  ],
})
export class SystemConfigModule {}