import { Module } from "@nestjs/common";
import { FactoryService } from "./factory.service";
import { FactoryResolver } from "./factory.resolver";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [FactoryService, FactoryResolver],
    exports: [FactoryService]
})
export class FactoryModule {}