import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { createClient } from "redis"
import { envConfig } from "../dynamic-modules"

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: ReturnType<typeof createClient>

    async onModuleInit() {
        this.client = createClient({
            url: envConfig().redis.url
        })

        await this.client.connect()
    }

    async onModuleDestroy() {
        await this.client.quit()
    }

    async setRefreshToken(userId: string, token: string) {
        await this.client.set(`refresh_token:${userId}`, token, {
            EX: parseInt(envConfig().redis.ttl as string)
        })
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        return await this.client.get(`refresh_token:${userId}`)
    }

    async removeRefreshToken(userId: string) {
        await this.client.del(`refresh_token:${userId}`)
    }

    async getCache(key: string) {
        return await this.client.get(key)
    }

    async setCache(key: string, value: string, ttl?: number) {
        await this.client.set(key, value, {
            EX: ttl || parseInt(envConfig().redis.otpTtl as string)
        })
    }

    async removeCache(key: string) {
        await this.client.del(key)
    }

    async getTTL(key: string): Promise<number> {
        return await this.client.ttl(key)
    }
}
