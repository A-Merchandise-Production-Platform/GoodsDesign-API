import { Module } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"
import { NotificationsGateway } from "./notifications.gateway"
import { NotificationsResolver } from "./notifications.resolver"
import { PrismaModule } from "src/prisma"
import { JwtModule } from "@nestjs/jwt"
import { envConfig, TokenType } from "src/dynamic-modules"

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: envConfig().jwt[TokenType.AccessToken].secret,
            signOptions: { expiresIn: envConfig().jwt[TokenType.AccessToken].expiresIn }
        })
    ],
    providers: [NotificationsGateway, NotificationsService, NotificationsResolver],
    exports: [NotificationsService]
})
export class NotificationsModule {}
