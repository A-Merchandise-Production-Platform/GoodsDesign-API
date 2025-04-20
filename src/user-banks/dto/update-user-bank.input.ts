import { CreateUserBankInput } from "./create-user-bank.input"
import { InputType, PartialType } from "@nestjs/graphql"

@InputType()
export class UpdateUserBankInput extends PartialType(CreateUserBankInput) {} 