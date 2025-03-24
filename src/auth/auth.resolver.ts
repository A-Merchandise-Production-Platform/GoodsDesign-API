import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { AuthService } from "./auth.service"
import { CurrentUser } from "./decorators"
import { AuthResponseDto, RegisterDto, LoginDto, RefreshTokenDto } from "./dto"
import { GraphqlJwtAuthGuard } from "./guards"
import { UserEntity } from "src/users"

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthResponseDto)
    async register(@Args("registerInput") registerInput: RegisterDto) {
        return this.authService.register(registerInput)
    }

    @Mutation(() => AuthResponseDto)
    async login(@Args("loginInput") loginInput: LoginDto) {
        return this.authService.login(loginInput)
    }

    @Mutation(() => AuthResponseDto)
    @UseGuards(GraphqlJwtAuthGuard)
    async refreshToken(
        @Args("refreshTokenInput") refreshTokenInput: RefreshTokenDto,
        @CurrentUser() user: UserEntity
    ) {
        return this.authService.refreshToken(refreshTokenInput, user)
    }

    @Mutation(() => String)
    @UseGuards(GraphqlJwtAuthGuard)
    async logout(@CurrentUser() user: UserEntity) {
        return this.authService.logout(user.id)
    }

    @Query(() => UserEntity)
    @UseGuards(GraphqlJwtAuthGuard)
    async getMe(@CurrentUser() user: UserEntity) {
        return user
    }
}
