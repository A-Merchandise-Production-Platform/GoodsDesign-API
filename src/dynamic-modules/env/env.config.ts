import { DEFAULT_DATABASE_URL, DEFAULT_PORT } from "./env.constants"

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
    },
    shipping: {
        token: process.env.GHN_TOKEN || "",
        shopId: process.env.GHN_SHOP_ID || "",
        baseUrl: process.env.GHN_BASE_URL || ""
    },
    payment: {
        payos: {
            clientId: process.env.PAYMENT_PAYOS_CLIENT_ID || "",
            apiKey: process.env.PAYMENT_PAYOS_API_KEY || "",
            checksumKey: process.env.PAYMENT_PAYOS_CHECKSUM_KEY || ""
        },
        vnpay: {
            returnUrl: process.env.PAYMENT_VNPAY_RETURN_URL || "",
            paymentUrl: process.env.PAYMENT_VNPAY_PAYMENT_URL || "",
            tmnCode: process.env.PAYMENT_VNPAY_TMN_CODE || "",
            hashSecret: process.env.PAYMENT_VNPAY_HASH_SECRET || "",
            version: process.env.PAYMENT_VNPAY_VERSION || "2.1.0"
        }
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || ""
    }
})

export enum TokenType {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken"
}
