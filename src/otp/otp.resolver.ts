import { Resolver, Mutation, Args, Query } from "@nestjs/graphql"
import { Otp } from "./entities/otp.entity"
import { OtpService } from "./otp.service"
import { CreateOtpInput } from "./dto/create-otp.input"
import { VerifyOtpInput } from "./dto/verify-otp.input"

@Resolver(() => Otp)
export class OtpResolver {
    constructor(private readonly otpService: OtpService) {}

    @Mutation(() => Otp)
    createOTP(@Args("createOtpInput") createOtpInput: CreateOtpInput) {
        return this.otpService.createOTP(createOtpInput)
    }

    @Mutation(() => Boolean)
    verifyOTP(@Args("verifyOtpInput") verifyOtpInput: VerifyOtpInput) {
        return this.otpService.verifyOTP(verifyOtpInput)
    }

    @Query(() => Date)
    getExpiredTime(@Args("email") email: string) {
        return this.otpService.getExpiredTime(email)
    }

    @Mutation(() => Boolean)
    resendOTP(@Args("email") email: string) {
        return this.otpService.resendOTP(email)
    }
}
