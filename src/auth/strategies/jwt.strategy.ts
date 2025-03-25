import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "../../prisma/prisma.service"
import { envConfig, TokenType } from "src/dynamic-modules"
import { UserEntity } from "src/users/entities/users.entity"
import { FactoryEntity } from "src/factory/entities/factory.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: envConfig().jwt[TokenType.AccessToken].secret
        })
    }

    async validate(payload: { sub: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub, isDeleted: false, isActive: true },
            include: {
                factory: true
            }
        })

        return new UserEntity({
            ...user,
            factory: user?.factory ? new FactoryEntity(user.factory) : null
        })
    }
}
