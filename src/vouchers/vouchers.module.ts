import { Module } from "@nestjs/common"
import { VouchersService } from "./vouchers.service"
import { VouchersResolver } from "./vouchers.resolver"
import { NotificationsModule } from "src/notifications/notifications.module"
import { PrismaModule } from "@/prisma"

@Module({
    imports: [PrismaModule, NotificationsModule],
    providers: [VouchersResolver, VouchersService],
    exports: [VouchersService]
})
export class VouchersModule {}
