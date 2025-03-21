import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../prisma/prisma.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { TokenType, envConfig } from "../dynamic-modules"
import { compare, hash } from "bcrypt"
import { Roles } from "@prisma/client"
import { UsersService } from "../users/users.service"
import { UserEntity } from "../users/entities/users.entity"
import { RedisService } from "../redis/redis.service"
import { AuthResponseDto } from "src/auth/dto"
import { RegisterFactoryOwnerDto } from "./dto/register-factory-owner.dto"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redisService: RedisService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.prisma.user.findFirst({
            where: { email, isDeleted: false }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials")
        }

        return new UserEntity(user)
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password)

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

        return new AuthResponseDto(new UserEntity(user), accessToken, refreshToken)
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw new BadRequestException("Email already exists")
        }

        const hashedPassword = await hash(registerDto.password, 10)

        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
                role: Roles.CUSTOMER,
                isActive: true
            }
        })

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

        return new AuthResponseDto(new UserEntity(user), accessToken, refreshToken)
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto, currentUser: UserEntity) {
        const user = await this.prisma.user.findFirst({
            where: { id: currentUser.id, isDeleted: false }
        })

        const storedToken = await this.redisService.getRefreshToken(user.id)

        if (!user) {
            throw new UnauthorizedException("Invalid token")
        }

        if (storedToken !== refreshTokenDto.refreshToken) {
            throw new UnauthorizedException("Invalid token")
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

        return new AuthResponseDto(new UserEntity(user), accessToken, refreshToken)
    }

    private async generateToken(userId: string, type: TokenType): Promise<string> {
        const config = envConfig().jwt[type]
        const token = await this.jwtService.signAsync(
            { sub: userId },
            {
                secret: config.secret,
                expiresIn: config.expiresIn
            }
        )
        return token
    }

    async logout(userId: string) {
        await this.redisService.removeRefreshToken(userId)
        return "Logged out successfully"
    }

    async registerFactoryOwner(registerDto: RegisterFactoryOwnerDto) {
        const { factoryInformation, ...userDto } = registerDto

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: userDto.email },
                    { phoneNumber: userDto.phoneNumber }
                ]
            }
        })

        if (existingUser) {
            throw new BadRequestException("User already exists with this email or phone number")
        }

        const hashedPassword = await hash(userDto.password, 10)

        // Use transaction to create both user and factory
        const result = await this.prisma.$transaction(async (tx) => {
            // Create user with FACTORYOWNER role
            const user = await tx.user.create({
                data: {
                    ...userDto,
                    password: hashedPassword,
                    role: Roles.FACTORYOWNER,
                    isActive: true,
                    imageUrl: userDto.imageUrl ||
                        `https://api.dicebear.com/9.x/thumbs/svg?seed=${userDto.name}`,
                    dateOfBirth: userDto.dateOfBirth ? new Date(userDto.dateOfBirth) : null
                }
            })

            // Create factory record
            await tx.factory.create({
                data: {
                    factoryOwnerId: user.id,
                    information: {
                        ...factoryInformation,
                        createdAt: new Date().toISOString()
                    },
                    contract: {} // Empty contract initially
                }
            })

            return user
        })

        // Generate tokens
        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(result.id, TokenType.AccessToken),
            this.generateToken(result.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(result.id, refreshToken)

        return new AuthResponseDto(new UserEntity(result), accessToken, refreshToken)
    }
}
