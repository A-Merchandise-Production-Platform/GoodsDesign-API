import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { envConfig, TokenType } from "src/dynamic-modules"
import { NotificationsModule } from "src/notifications/notifications.module"
import { PrismaModule } from "src/prisma"
import { RedisModule } from "src/redis"
import { UsersModule } from "src/users"
import { AuthResolver } from "./auth.resolver"
import { AuthService } from "./auth.service"
import { RolesGuard } from "./guards"
import { JwtStrategy } from "./strategies"
import { MailModule } from "src/mail"

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: envConfig().jwt[TokenType.AccessToken].secret,
            signOptions: { expiresIn: envConfig().jwt[TokenType.AccessToken].expiresIn }
        }),
        RedisModule,
        UsersModule,
        NotificationsModule,
        MailModule
    ],
    providers: [AuthService, JwtStrategy, RolesGuard, AuthResolver],
    exports: [AuthService]
})
export class AuthModule {}
