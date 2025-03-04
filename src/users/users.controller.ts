import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Get all active users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all active users.',
    type: [UserResponseDto],
  })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The found user.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(Roles.ADMIN)
  @ApiOperation({ summary: 'Update a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(Roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully deleted.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  remove(
    @Param('id') id: string,
    @Body('deletedBy') deletedBy: string,
  ): Promise<UserResponseDto> {
    return this.usersService.remove(id, deletedBy);
  }
}