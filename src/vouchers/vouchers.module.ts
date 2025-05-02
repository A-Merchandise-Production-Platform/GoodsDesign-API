import { Module } from "@nestjs/common"
import { VouchersService } from "./vouchers.service"
import { VouchersResolver } from "./vouchers.resolver"
import { PrismaModule } from "src/prisma"

@Module({
    imports: [PrismaModule],
    providers: [VouchersResolver, VouchersService],
    exports: [VouchersService]
})
export class VouchersModule {}
