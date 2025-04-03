import { Module } from "@nestjs/common";
import { FactoryService } from "./factory.service";
import { FactoryResolver } from "./factory.resolver";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
    imports: [PrismaModule, NotificationsModule],
    providers: [FactoryService, FactoryResolver],
    exports: [FactoryService]
})
export class FactoryModule {}