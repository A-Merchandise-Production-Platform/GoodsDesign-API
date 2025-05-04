import { Module } from "@nestjs/common"
import { PrismaModule } from "src/prisma"
import { ShippingModule } from "src/shipping/shipping.module"
import { AddressesResolver } from "./addresses.resolver"
import { AddressesService } from "./addresses.service"

@Module({
    imports: [PrismaModule, ShippingModule],
    providers: [AddressesResolver, AddressesService],
    exports: [AddressesService]
})
export class AddressesModule {}
