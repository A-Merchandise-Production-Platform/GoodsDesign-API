import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { FactoryStatus, Roles } from "@prisma/client"
import { compare, hash } from "bcrypt"
import { AuthResponseDto } from "src/auth/dto"
import { TokenType, envConfig } from "../dynamic-modules"
import { PrismaService } from "../prisma/prisma.service"
import { RedisService } from "../redis/redis.service"
import { UserEntity } from "../users/entities/users.entity"
import { LoginDto } from "./dto/login.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RegisterDto } from "./dto/register.dto"
import { FactoryEntity } from "src/factory/entities/factory.entity"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redisService: RedisService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.prisma.user.findFirst({
            where: { email, isDeleted: false },
            include: {
                factory: true
            }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials")
        }

        return new UserEntity({
            ...user,
            factory: user.factory ? new FactoryEntity(user.factory) : null
        })
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password)

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

        console.log(user)

        return new AuthResponseDto(user, accessToken, refreshToken)
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw new BadRequestException("Email already exists")
        }

        const hashedPassword = await hash(registerDto.password, 10)

        // Determine the role based on isFactoryOwner flag
        const role = registerDto.isFactoryOwner ? Roles.FACTORYOWNER : Roles.CUSTOMER

        // Create user with appropriate role
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
                role: role,
                isActive: true
            }
        })

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

        if (registerDto.isFactoryOwner) {
            const factory = await this.prisma.factory.create({
                data: {
                    factoryOwnerId: user.id,
                    name: `${user.name}'s Factory`,
                    factoryStatus: FactoryStatus.PENDING_APPROVAL,
                    establishedDate: new Date(),
                    totalEmployees: 1,
                    maxPrintingCapacity: 0,
                    printingMethods: [],
                    specializations: [],
                    contactPersonName: user.name,
                    contactPersonRole: "Factory Owner",
                    contactPhone: user.phoneNumber || "",
                    operationalHours: "",
                    leadTime: 0,
                    minimumOrderQuantity: 0,
                    contractUrl: ""
                }
            })

            console.log(factory)

            return new AuthResponseDto(
                new UserEntity({
                    ...user,
                    factory: new FactoryEntity({
                        ...factory
                    })
                }),
                accessToken,
                refreshToken
            )
        }

        return new AuthResponseDto(new UserEntity(user), accessToken, refreshToken)
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto, currentUser: UserEntity) {
        const user = await this.prisma.user.findFirst({
            where: { id: currentUser.id, isDeleted: false },
            include: {
                factory: true
            }
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

        return new AuthResponseDto(
            new UserEntity({
                ...user,
                factory: user.factory ? new FactoryEntity(user.factory) : null
            }),
            accessToken,
            refreshToken
        )
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
}
