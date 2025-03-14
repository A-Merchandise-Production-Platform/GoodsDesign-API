import { DEFAULT_DATABASE_URL, DEFAULT_PORT } from "./env.constants";

export const envConfig = () => ({
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    port: process.env.PORT || DEFAULT_PORT,
    jwt: {
        [TokenType.AccessToken]: {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET || "access-token",
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m"
        },
        [TokenType.RefreshToken]: {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET || "refresh-token",
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d"
        }
    },
    redis: {
        url: process.env.REDIS_URL || "redis://localhost:6380",
        ttl: process.env.REDIS_TTL || "604800" //60 * 60 * 24 * 7
    }
})

export enum TokenType {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken"
}

