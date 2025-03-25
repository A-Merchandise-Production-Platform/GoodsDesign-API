import { Module } from "@nestjs/common"
import { CustomerOrdersService } from "./customer-orders.service"
import { CustomerOrdersResolver } from "./customer-orders.resolver"
import { PrismaModule } from "../prisma/prisma.module"
import { CartItemsModule } from "../cart-items/cart-items.module"
import { SystemConfigDiscountModule } from "../system-config-discount/system-config-discount.module"

@Module({
    imports: [PrismaModule, CartItemsModule, SystemConfigDiscountModule],
    providers: [CustomerOrdersService, CustomerOrdersResolver],
    exports: [CustomerOrdersService]
})
export class CustomerOrdersModule {}
