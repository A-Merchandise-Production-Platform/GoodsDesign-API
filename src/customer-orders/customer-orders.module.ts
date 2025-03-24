import { Module } from "@nestjs/common"
import { CustomerOrdersService } from "./customer-orders.service"
import { CustomerOrdersResolver } from "./customer-orders.resolver"
import { PrismaService } from "../prisma/prisma.service"
import { CartItemsService } from "../cart-items/cart-items.service"

@Module({
    providers: [CustomerOrdersResolver, CustomerOrdersService, PrismaService, CartItemsService],
    exports: [CustomerOrdersService]
})
export class CustomerOrdersModule {}
