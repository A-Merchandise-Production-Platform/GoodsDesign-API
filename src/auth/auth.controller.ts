import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { AuthDto } from "./dto/auth.dto"
import { RegisterDto } from "./dto/register.dto"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { AuthResponseDto } from "./dto/auth-response.dto"
import { Auth } from "./decorators/auth.decorator"
import { GetUser } from "./decorators"
import { User } from "@prisma/client"
import { UserEntity } from "src/users/entities/users.entity"

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({
        status: 201,
        description: "User successfully registered",
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 400,
        description: "Bad request - Invalid input data"
    })
    @ApiResponse({
        status: 401,
        description: "User with this email already exists"
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @Post("login")
    @ApiOperation({ summary: "User login" })
    @ApiResponse({
        status: 201,
        description: "User successfully logged in",
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 401,
        description: "Invalid credentials"
    })
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto)
    }

    @Post("refresh")
    @Auth()
    @ApiOperation({ summary: "Refresh access token" })
    @ApiResponse({
        status: 200,
        description: "New tokens generated successfully",
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 401,
        description: "Invalid refresh token"
    })
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @GetUser() user: UserEntity) {
        console.log(user)
        return this.authService.refreshToken(refreshTokenDto, user)
    }

    @Post("logout")
    @Auth()
    @ApiOperation({ summary: "Logout user" })
    @ApiResponse({
        status: 200,
        description: "User logged out successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Logged out successfully"
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized"
    })
    async logout(@GetUser("userId") userId: string) {
        return this.authService.logout(userId)
    }

    @Get("me")
    @Auth()
    @ApiOperation({ summary: "Get user details" })
    @ApiResponse({
        status: 200,
        description: "User details retrieved successfully",
        type: UserEntity
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized"
    })
    getMe(@GetUser() user: User) {
        return new UserEntity(user)
    }
}
