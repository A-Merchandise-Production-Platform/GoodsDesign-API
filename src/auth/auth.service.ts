import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...rest } = registerDto;

    // Check if user exists
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default CUSTOMER role
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        role: Roles.CUSTOMER, // Set default role
        isActive: true, // Activate user upon registration
      },
    });

    // Generate JWT
    const token = await this.signToken(user.id);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: token,
    };
  }

  async login(authDto: AuthDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const passwordValid = await bcrypt.compare(authDto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const token = await this.signToken(user.id);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: token,
    };
  }

  private async signToken(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'super-secret',
      expiresIn: '1d',
    });
  }
}
