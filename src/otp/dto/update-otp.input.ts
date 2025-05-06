import { InputType, PartialType } from "@nestjs/graphql"
import { CreateOtpInput } from "./create-otp.input"

@InputType()
export class UpdateOtpInput extends PartialType(CreateOtpInput) {}
