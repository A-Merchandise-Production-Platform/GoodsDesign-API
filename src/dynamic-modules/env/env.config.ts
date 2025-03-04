import { DEFAULT_PORT } from "./env.constants";

export const envConfig = () => ({
    databaseUrl: process.env.DATABASE_URL || "db",
    port: process.env.PORT || DEFAULT_PORT,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
})
