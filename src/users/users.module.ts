import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { PrismaModule } from "../prisma/prisma.module"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { envConfig, TokenType } from "../dynamic-modules"
import { UsersResolver } from "./users.resolver"

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: envConfig().jwt[TokenType.AccessToken].secret,
            signOptions: { expiresIn: envConfig().jwt[TokenType.AccessToken].expiresIn } // e.g. 30s, 7d, 24h
        })
    ],
    providers: [UsersService, UsersResolver],
    exports: [UsersService]
})
export class UsersModule {}
