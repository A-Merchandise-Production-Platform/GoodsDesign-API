import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "../../prisma/prisma.service"
import { envConfig, TokenType } from "src/dynamic-modules"
import { UserEntity } from "src/users/entities/users.entity"

@Injectable()
export class NoExpiredJwtStrategy extends PassportStrategy(Strategy, "no-expired-jwt") {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: envConfig().jwt[TokenType.AccessToken].secret
        })
    }

    async validate(payload: { sub: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        })

        if (!user || user.isDeleted) {
            throw new UnauthorizedException("Unauthorized")
        }

        if (!user.isActive) {
            throw new UnauthorizedException("User is not active")
        }

        return new UserEntity(user)
    }
}
