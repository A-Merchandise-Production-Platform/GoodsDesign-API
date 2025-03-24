import { Module } from "@nestjs/common"
import { AddressesService } from "./addresses.service"
import { AddressesResolver } from "./addresses.resolver"
import { PrismaModule } from "src/prisma"

@Module({
    imports: [PrismaModule],
    providers: [AddressesResolver, AddressesService],
    exports: [AddressesService]
})
export class AddressesModule {}
