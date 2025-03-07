import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RolesGuard } from "../guards/roles.guard"
import { Roles } from "@prisma/client"
import { ROLES_KEY } from "./roles.decorator"

export function Auth(...roles: Roles[]) {
    if (roles.length < 1) {
        return applyDecorators(
            ApiBearerAuth(),
            UseGuards(JwtAuthGuard, RolesGuard),
            ApiUnauthorizedResponse({
                description: "Unauthorized - Invalid token or insufficient permissions"
            })
        )
    }

    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        ApiBearerAuth(),
        UseGuards(JwtAuthGuard, RolesGuard),
        ApiUnauthorizedResponse({
            description: "Unauthorized - Invalid token or insufficient permissions"
        })
    )
}
