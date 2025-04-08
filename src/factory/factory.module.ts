import { Module } from "@nestjs/common"
import { FactoryService } from "./factory.service"
import { FactoryResolver } from "./factory.resolver"
import { PrismaModule } from "../prisma/prisma.module"
import { AddressesModule } from "src/addresses/addresses.module"
import { NotificationsModule } from "src/notifications/notifications.module"
import { FactoryProductsModule } from "src/factory-products/factory-products.module"
import { MailModule } from "src/mail"

@Module({
    imports: [
        PrismaModule,
        AddressesModule,
        NotificationsModule,
        FactoryProductsModule,
        MailModule
    ],
    providers: [FactoryService, FactoryResolver],
    exports: [FactoryService]
})
export class FactoryModule {}
