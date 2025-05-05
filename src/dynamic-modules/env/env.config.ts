import { DEFAULT_DATABASE_URL, DEFAULT_PORT } from "./env.constants"

export const envConfig = () => ({
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    port: process.env.PORT || DEFAULT_PORT,
    app: {
        frontendUrl: process.env.APP_FRONTEND_URL || "http://localhost:3000",
        backendUrl: process.env.APP_BACKEND_URL || "http://localhost:3000"
    },
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
        ttl: process.env.REDIS_TTL || "604800", //60 * 60 * 24 * 7
        otpTtl: process.env.REDIS_OTP_TTL || "300" //5 minutes
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
            checksumKey: process.env.PAYMENT_PAYOS_CHECKSUM_KEY || "",
            cancelUrl: process.env.PAYMENT_PAYOS_CANCEL_URL || "",
            returnUrl: process.env.PAYMENT_PAYOS_RETURN_URL || ""
        },
        vnpay: {
            returnUrl: process.env.PAYMENT_VNPAY_RETURN_URL || "",
            vnpUrl: process.env.PAYMENT_VNPAY_VNP_URL || "",
            tmnCode: process.env.PAYMENT_VNPAY_TMN_CODE || "",
            hashSecret: process.env.PAYMENT_VNPAY_HASH_SECRET || "",
            version: process.env.PAYMENT_VNPAY_VERSION || "2.1.0"
        }
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || ""
    },
    upload: {
        maxFileSize: process.env.UPLOAD_MAX_FILE_SIZE || 50000000, //50mb
        maxFiles: process.env.UPLOAD_MAX_FILES || 1
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY || ""
    }
})

export enum TokenType {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken"
}
