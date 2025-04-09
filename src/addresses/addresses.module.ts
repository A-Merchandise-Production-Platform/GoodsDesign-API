import { Module } from "@nestjs/common"
import { AddressesService } from "./addresses.service"
import { AddressesResolver } from "./addresses.resolver"
import { PrismaModule } from "src/prisma"
import { ShippingModule } from "src/shipping/shipping.module"

@Module({
    imports: [PrismaModule, ShippingModule],
    providers: [AddressesResolver, AddressesService],
    exports: [AddressesService]
})
export class AddressesModule {}
