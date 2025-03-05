import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import { promisify } from 'util';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof createClient>;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6380',
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setRefreshToken(userId: string, token: string, expiresIn: number) {
    await this.client.set(`refresh_token:${userId}`, token, {
      EX: expiresIn,
    });
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return await this.client.get(`refresh_token:${userId}`);
  }

  async removeRefreshToken(userId: string) {
    await this.client.del(`refresh_token:${userId}`);
  }
}