import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { envConfig } from 'src/dynamic-modules';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: envConfig().jwt.secret || 'super-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
