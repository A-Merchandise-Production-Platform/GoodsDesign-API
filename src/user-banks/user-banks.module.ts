import { Module } from "@nestjs/common"
import { UserBanksService } from "./user-banks.service"
import { UserBanksResolver } from "./user-banks.resolver"
import { PrismaModule } from "src/prisma"

@Module({
    imports: [PrismaModule],
    providers: [UserBanksResolver, UserBanksService],
    exports: [UserBanksService]
})
export class UserBanksModule {} 