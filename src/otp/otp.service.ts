import { BadRequestException, Injectable } from "@nestjs/common"
import { RedisService } from "../redis/redis.service"
import { CreateOtpInput } from "./dto/create-otp.input"
import { VerifyOtpInput } from "./dto/verify-otp.input"
import { Otp } from "./entities/otp.entity"
import { envConfig } from "@/dynamic-modules"
import { MAIL_CONSTANT, MailService, MailTemplateMap, MailTemplateType } from "@/mail"
import { UsersService } from "@/users"

@Injectable()
export class OtpService {
    constructor(
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        private readonly usersService: UsersService
    ) {}

    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    async createOTP(createOtpInput: CreateOtpInput): Promise<Otp> {
        const code = this.generateOTP()
        const key = `email_otp:${createOtpInput.email}`

        // Store OTP in Redis with 5 minutes expiration
        await this.redisService.setCache(key, code, parseInt(envConfig().redis.otpTtl))

        await this.mailService.sendSingleEmail({
            from: MAIL_CONSTANT.FROM_EMAIL,
            to: createOtpInput.email,
            subject: "GoodsDesign - OTP",
            html: MailTemplateMap[MailTemplateType.OTP].htmlGenerate({
                otp: code,
                expiresInMinutes: 5
            })
        })

        return new Otp({
            email: createOtpInput.email,
            code: code
        })
    }

    async verifyOTP(verifyOtpInput: VerifyOtpInput): Promise<boolean> {
        const key = `email_otp:${verifyOtpInput.email}`
        console.log(key)
        const storedOTP = await this.redisService.getCache(key)
        console.log(storedOTP)

        if (!storedOTP) {
            throw new BadRequestException("Invalid OTP")
        }

        const isValid = storedOTP === verifyOtpInput.code

        if (!isValid) {
            throw new BadRequestException("Invalid OTP")
        }

        await this.redisService.removeCache(key)
        await this.usersService.verifyEmail(verifyOtpInput.email)

        return isValid
    }

    async getExpiredTime(email: string): Promise<Date | null> {
        const key = `email_otp:${email}`
        const ttl = await this.redisService.getTTL(key)

        if (ttl <= 0) {
            return null
        }

        const expirationDate = new Date()
        expirationDate.setSeconds(expirationDate.getSeconds() + ttl)

        return expirationDate
    }

    async resendOTP(email: string) {
        //check if email is have otp in redis if yes throw bad request
        const key = `email_otp:${email}`
        const expiredTime = await this.redisService.getCache(key)
        if (expiredTime) {
            throw new BadRequestException(
                `OTP already sent, please wait ${parseInt(envConfig().redis.otpTtl) / 60} minutes before resending`
            )
        }

        const otp = await this.createOTP({ email })
        if (otp) {
            return true
        }

        return false
    }
}
