import { Module } from "@nestjs/common"
import { VouchersService } from "./vouchers.service"
import { VouchersResolver } from "./vouchers.resolver"
import { PrismaModule } from "src/prisma"
import { NotificationsModule } from "src/notifications/notifications.module"

@Module({
    imports: [PrismaModule, NotificationsModule],
    providers: [VouchersResolver, VouchersService],
    exports: [VouchersService]
})
export class VouchersModule {}
