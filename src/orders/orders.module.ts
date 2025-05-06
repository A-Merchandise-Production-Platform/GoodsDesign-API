import { Module } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { OrdersResolver } from "./orders.resolver"
import { PrismaModule } from "src/prisma"
import { NotificationsModule } from "src/notifications/notifications.module"
import { ShippingModule } from "src/shipping/shipping.module"
import { VouchersModule } from "src/vouchers/vouchers.module"
import { SystemConfigOrderModule } from "src/system-config-order/system-config-order.module"
import { MailModule } from "@/mail"
@Module({
    imports: [
        PrismaModule,
        NotificationsModule,
        ShippingModule,
        VouchersModule,
        SystemConfigOrderModule,
        MailModule
    ],
    providers: [OrdersResolver, OrdersService]
})
export class OrdersModule {}
