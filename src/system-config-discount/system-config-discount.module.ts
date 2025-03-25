import { Module } from "@nestjs/common"
import { SystemConfigDiscountService } from "./system-config-discount.service"
import { SystemConfigDiscountResolver } from "./system-config-discount.resolver"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    providers: [SystemConfigDiscountService, SystemConfigDiscountResolver],
    exports: [SystemConfigDiscountService]
})
export class SystemConfigDiscountModule {}
