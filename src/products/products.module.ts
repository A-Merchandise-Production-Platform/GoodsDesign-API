import { Module } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { PrismaModule } from "../prisma/prisma.module"
import { CategoriesModule } from "../categories/categories.module"
import { ProductsResolver } from "./products.resolver"

@Module({
    imports: [PrismaModule, CategoriesModule],
    providers: [ProductsService, ProductsResolver],
    exports: [ProductsService]
})
export class ProductsModule {}
