import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import { AuthDto } from "./dto/auth.dto"
import { RegisterDto } from "./dto/register.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import * as bcrypt from "bcrypt"
import { Roles } from "@prisma/client"
import { envConfig, TokenType } from "../dynamic-modules"
import { RedisService } from "../redis/redis.service"
import { User } from "src/generated/nestjs-dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService
    ) {}

    async register(registerDto: RegisterDto) {
        const { password, ...rest } = registerDto

        // Check if user exists
        const userExists = await this.prisma.user.findUnique({
            where: { email: registerDto.email }
        })

        if (userExists) {
            throw new UnauthorizedException("User with this email already exists")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user with default CUSTOMER role
        const user = await this.prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
                role: Roles.CUSTOMER, // Set default role
                isActive: true // Activate user upon registration
            }
        })

        // Generate tokens
        const tokens = await this.signTokens(user.id)

        return {
            user: new User(user),
            ...tokens
        }
    }

    async login(authDto: AuthDto) {
        // Find user
        console.log(authDto)

        const user = await this.prisma.user.findUnique({
            where: { email: authDto.email }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Check password
        const passwordValid = await bcrypt.compare(authDto.password, user.password)

        if (!passwordValid) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Generate tokens
        const tokens = await this.signTokens(user.id)

        console.log(tokens)

        return {
            user: new User(user),
            ...tokens
        }
    }

    private async signTokens(userId: string) {
        const payload = { userId }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: envConfig().jwt[TokenType.AccessToken].secret,
                expiresIn: envConfig().jwt[TokenType.AccessToken].expiresIn
            }),
            this.jwtService.signAsync(payload, {
                secret: envConfig().jwt[TokenType.RefreshToken].secret,
                expiresIn: envConfig().jwt[TokenType.RefreshToken].expiresIn
            })
        ])

        // Store refresh token in Redis
        await this.redisService.setRefreshToken(userId, refreshToken)

        return {
            accessToken,
            refreshToken
        }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto, user: User) {
        const storedToken = await this.redisService.getRefreshToken(user.id)

        const validRefreshToken = this.jwtService.verify(refreshTokenDto.refreshToken, {
            secret: envConfig().jwt[TokenType.RefreshToken].secret
        })

        if (!validRefreshToken) {
            throw new UnauthorizedException("Invalid refresh token")
        }

        if (!storedToken || storedToken !== refreshTokenDto.refreshToken) {
            throw new UnauthorizedException("Invalid refresh token")
        }

        const tokens = await this.signTokens(user.id)

        return {
            user: new User(user),
            ...tokens
        }
    }

    async logout(userId: string) {
        await this.redisService.removeRefreshToken(userId)
        return { message: "Logged out successfully" }
    }
}
