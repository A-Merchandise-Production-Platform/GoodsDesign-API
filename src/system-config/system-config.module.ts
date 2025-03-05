import { Module } from '@nestjs/common';
import { SystemConfigBanksModule } from './banks/system-config-banks.module';
import { SystemConfigColorsModule } from './colors/system-config-colors.module';
import { SystemConfigSizesModule } from './sizes/system-config-sizes.module';

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