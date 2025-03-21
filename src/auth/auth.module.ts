import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthResolver } from "src/auth/auth.resolver"
import { envConfig, TokenType } from "src/dynamic-modules"
import { PrismaModule } from "../prisma/prisma.module"
import { RedisModule } from "../redis/redis.module"
import { UsersModule } from "../users/users.module"
import { AuthService } from "./auth.service"
import { RolesGuard } from "./guards/roles.guard"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { MailModule } from "src/mail/mail.module"

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
        MailModule
    ],
    providers: [AuthService, JwtStrategy, RolesGuard, AuthResolver],
    exports: [AuthService]
})
export class AuthModule {}
