import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private toUserResponse(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null,
      },
    });
    return this.toUserResponse(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
    });
    return users.map(user => this.toUserResponse(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { id }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.toUserResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        dateOfBirth: updateUserDto.dateOfBirth ? new Date(updateUserDto.dateOfBirth) : undefined,
        updatedAt: new Date(),
      },
    });

    return this.toUserResponse(updatedUser);
  }

  async remove(id: string, deletedBy: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
      },
    });

    return this.toUserResponse(deletedUser);
  }
}