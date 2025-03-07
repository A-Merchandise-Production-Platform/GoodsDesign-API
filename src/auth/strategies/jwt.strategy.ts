import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "../../prisma/prisma.service"
import { envConfig, TokenType } from "src/dynamic-modules"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envConfig().jwt[TokenType.AccessToken].secret
        })
    }

    async validate(payload: { userId: string }) {
        console.log(payload)

        const user = await this.prisma.user.findUnique({
            where: { id: payload.userId }
        })

        console.log(user)

        if (!user) {
            throw new UnauthorizedException("Unauthorized")
        }
        return user
    }
}
