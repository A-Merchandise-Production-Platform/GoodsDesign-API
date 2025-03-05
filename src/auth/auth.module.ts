import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { envConfig, TokenType } from 'src/dynamic-modules';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: envConfig().jwt[TokenType.AccessToken].secret,
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
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
