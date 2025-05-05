import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { FactoryStatus, Roles } from "@prisma/client"
import { compare, hash } from "bcrypt"
import { AuthResponseDto } from "src/auth/dto"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { NotificationsService } from "src/notifications/notifications.service"
import { TokenType, envConfig } from "../dynamic-modules"
import { PrismaService } from "../prisma/prisma.service"
import { RedisService } from "../redis/redis.service"
import { UserEntity } from "../users/entities/users.entity"
import { LoginDto } from "./dto/login.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { RegisterDto } from "./dto/register.dto"
import { MAIL_CONSTANT, MailService, MailTemplateMap, MailTemplateType } from "src/mail"
import { OtpService } from "@/otp/otp.service"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redisService: RedisService,
        private notificationsService: NotificationsService,
        private mailService: MailService,
        private otpService: OtpService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.prisma.user.findFirst({
            where: { email, isDeleted: false, isActive: true },
            include: {
                ownedFactory: true
            }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials - Email did not exist")
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials - Wrong password")
        }

        return new UserEntity({
            ...user,
            ownedFactory: user.ownedFactory ? new FactoryEntity(user.ownedFactory) : null
        })
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password)

        const [accessToken, refreshToken] = await Promise.all([
            this.generateToken(user.id, TokenType.AccessToken),
            this.generateToken(user.id, TokenType.RefreshToken)
        ])

        await this.redisService.setRefreshToken(user.id, refreshToken)

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

        this.notificationsService.create({
            title: "Welcome to the app",
            content: `Welcome ${user.name} to the app`,
            userId: user.id
        })

        if (registerDto.isFactoryOwner) {
            const factory = await this.prisma.factory.create({
                data: {
                    factoryOwnerId: user.id,
                    name: `${user.name}'s Factory`,
                    factoryStatus: FactoryStatus.PENDING_APPROVAL,
                    establishedDate: new Date(),
                    maxPrintingCapacity: 0,
                    printingMethods: [],
                    specializations: [],
                    contactPersonName: user.name,
                    contactPersonRole: "Factory Owner",
                    contactPhone: user.phoneNumber || "",
                    leadTime: 0,
                    contractUrl: ""
                }
            })

            this.notificationsService.create({
                title: "Factory created",
                content: `Factory ${factory.name} created successfully, update your factory profile for approval by admin`,
                userId: user.id
            })

            this.mailService.sendSingleEmail({
                from: MAIL_CONSTANT.FROM_EMAIL,
                to: user.email,
                subject: MailTemplateMap[MailTemplateType.FACTORY_CREATED].subject,
                html: MailTemplateMap[MailTemplateType.FACTORY_CREATED].htmlGenerate({
                    factoryName: factory.name
                })
            })

            return new AuthResponseDto(
                new UserEntity({
                    ...user,
                    ownedFactory: new FactoryEntity({
                        ...factory
                    })
                }),
                accessToken,
                refreshToken
            )
        }

        await this.otpService.createOTP({
            email: registerDto.email
        })

        return new AuthResponseDto(new UserEntity(user), accessToken, refreshToken)
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto, currentUser: UserEntity) {
        const user = await this.prisma.user.findFirst({
            where: { id: currentUser.id, isDeleted: false },
            include: {
                ownedFactory: true
            }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid token")
        }

        const storedToken = await this.redisService.getRefreshToken(user.id)

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
                ownedFactory: user.ownedFactory ? new FactoryEntity(user.ownedFactory) : null
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
