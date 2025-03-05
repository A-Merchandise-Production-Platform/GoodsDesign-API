import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './dynamic-modules';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    EnvModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
