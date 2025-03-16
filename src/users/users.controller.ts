import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { CreateUserDto, UpdateUserDto } from "./dto"
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiBearerAuth
} from "@nestjs/swagger"
import { Auth } from "../auth/decorators/auth.decorator"
import { Roles } from "@prisma/client"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"
import { UserEntity } from "./entities/users.entity"

@ApiTags("Users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @Auth(Roles.ADMIN)
    @ApiOperation({ summary: "Create a new user (Admin only)" })
    @ApiResponse({
        status: 201,
        description: "User has been successfully created.",
        type: UserEntity
    })
    @ApiBadRequestResponse({ description: "Invalid input data." })
    create(
        @Body() createUserDto: CreateUserDto,
        @CurrentUser() user: UserEntity
    ): Promise<UserEntity> {
        return this.usersService.create(createUserDto, user)
    }

    // @Get()
    // @Auth(Roles.ADMIN)
    // @ApiOperation({ summary: "Get all active users (Admin only)" })
    // @ApiResponse({
    //     status: 200,
    //     description: "List of all active users.",
    //     type: [UserEntity]
    // })
    // findAll(@CurrentUser() user: UserEntity): Promise<UserEntity[]> {
    //     return this.usersService.findAll(user)
    // }

    // @Get(":id")
    // @Auth(Roles.ADMIN)
    // @ApiOperation({ summary: "Get a user by ID" })
    // @ApiParam({ name: "id", description: "User ID" })
    // @ApiResponse({
    //     status: 200,
    //     description: "The found user.",
    //     type: UserEntity
    // })
    // @ApiNotFoundResponse({ description: "User not found." })
    // findOne(@Param("id") id: string): Promise<UserEntity> {
    //     return this.usersService.findOne(id)
    // }

    @Patch(":id")
    @Auth(Roles.ADMIN)
    @ApiOperation({ summary: "Update a user (Admin only)" })
    @ApiParam({ name: "id", description: "User ID" })
    @ApiResponse({
        status: 200,
        description: "User has been successfully updated.",
        type: UserEntity
    })
    @ApiNotFoundResponse({ description: "User not found." })
    @ApiBadRequestResponse({ description: "Invalid input data." })
    update(
        @Param("id") id: string,
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser() user: UserEntity
    ): Promise<UserEntity> {
        return this.usersService.update(id, updateUserDto, user)
    }

    @Delete(":id")
    @Auth(Roles.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Soft delete a user (Admin only)" })
    @ApiParam({ name: "id", description: "User ID" })
    @ApiResponse({
        status: 200,
        description: "User has been successfully deleted.",
        type: UserEntity
    })
    @ApiNotFoundResponse({ description: "User not found." })
    remove(@Param("id") id: string, @CurrentUser() user: UserEntity): Promise<UserEntity> {
        return this.usersService.remove(id, user)
    }
}
