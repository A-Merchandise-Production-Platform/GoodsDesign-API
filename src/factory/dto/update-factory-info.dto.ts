import { Field, InputType } from "@nestjs/graphql"
import { IsString, IsOptional } from "class-validator"

@InputType({ description: "Update factory information input" })
export class UpdateFactoryInfoDto {}
