import { Module } from "@nestjs/common"
import { BlankVariancesService } from "./blank-variances.service"
import { BlankVariancesResolver } from "./blank-variances.resolver"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    providers: [BlankVariancesService, BlankVariancesResolver]
})
export class BlankVariancesModule {}
