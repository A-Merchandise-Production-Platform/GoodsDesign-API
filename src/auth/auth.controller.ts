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
import { UserResponseDto } from "src/users"

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
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return new AuthResponseDto(await this.authService.register(registerDto))
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
    async login(@Body() authDto: AuthDto): Promise<AuthResponseDto> {
        console.log("Login request received:", { email: authDto.email })
        return new AuthResponseDto(await this.authService.login(authDto))
    }

    @Post("refresh")
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
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
    refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Req()
        req: Request & { user: User }
    ): Promise<AuthResponseDto> {
        console.log(req.user)
        return this.authService.refreshTokens(refreshTokenDto, req.user)
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
        type: UserResponseDto
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized"
    })
    getMe(@GetUser() user: User) {
        return user
    }
}
