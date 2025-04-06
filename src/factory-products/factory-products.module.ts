import { Module } from "@nestjs/common"
import { FactoryProductsService } from "./factory-products.service"
import { FactoryProductsResolver } from "./factory-products.resolver"
import { PrismaModule } from "src/prisma"

@Module({
    imports: [PrismaModule],
    providers: [FactoryProductsResolver, FactoryProductsService],
    exports: [FactoryProductsService]
})
export class FactoryProductsModule {}