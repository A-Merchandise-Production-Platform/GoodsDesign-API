import { Module } from "@nestjs/common"
import { CartItemsService } from "./cart-items.service"
import { CartItemsResolver } from "./cart-items.resolver"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    providers: [CartItemsResolver, CartItemsService],
    exports: [CartItemsService]
})
export class CartItemsModule {}