import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RolesGuard } from "../guards/roles.guard"
import { Roles } from "@prisma/client"
import { ROLES_KEY } from "./roles.decorator"

export function Auth(...roles: Roles[]) {
    if (roles.length < 1) {
        return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard))
    }

    return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(JwtAuthGuard, RolesGuard))
}
