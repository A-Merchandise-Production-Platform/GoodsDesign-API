import { Resolver, Mutation, Args, Query } from "@nestjs/graphql"
import { AuthService } from "src/auth/auth.service"
import { RegisterDto } from "src/auth/dto/register.dto"
import { AuthResponseDto } from "src/auth/dto/auth-response.dto"
import { LoginDto } from "src/auth/dto/login.dto"
import { RefreshTokenDto } from "src/auth/dto/refresh-token.dto"
import { RegisterFactoryOwnerDto } from "./dto/register-factory-owner.dto"
import { UseGuards } from "@nestjs/common"
import { GraphqlJwtAuthGuard } from "src/auth/guards/graphql-jwt-auth.guard"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { UserEntity } from "src/users/entities/users.entity"

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

    @Mutation(() => AuthResponseDto)
    async registerFactoryOwner(
        @Args("registerFactoryOwnerInput") registerFactoryOwnerInput: RegisterFactoryOwnerDto
    ) {
        return this.authService.registerFactoryOwner(registerFactoryOwnerInput)
    }
}
