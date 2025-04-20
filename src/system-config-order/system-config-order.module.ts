import { Module } from "@nestjs/common"
import { SystemConfigOrderService } from "./system-config-order.service"
import { SystemConfigOrderResolver } from "./system-config-order.resolver"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    providers: [SystemConfigOrderService, SystemConfigOrderResolver],
    exports: [SystemConfigOrderService]
})
export class SystemConfigOrderModule {} 