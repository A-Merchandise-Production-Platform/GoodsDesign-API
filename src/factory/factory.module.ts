import { Module } from "@nestjs/common"
import { FactoryProductsModule } from "src/factory-products/factory-products.module"
import { MailModule } from "src/mail"
import { NotificationsModule } from "src/notifications/notifications.module"
import { PrismaModule } from "../prisma/prisma.module"
import { FactoryResolver } from "./factory.resolver"
import { FactoryService } from "./factory.service"
import { AddressesModule } from "src/addresses/addresses.module"

@Module({
    imports: [
        PrismaModule,
        NotificationsModule,
        FactoryProductsModule,
        MailModule,
        AddressesModule
    ],
    providers: [FactoryService, FactoryResolver],
    exports: [FactoryService]
})
export class FactoryModule {}
