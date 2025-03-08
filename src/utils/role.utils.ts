import { Roles } from "@prisma/client"

export const roleHierarchy = {
    [Roles.ADMIN]: 5,
    [Roles.MANAGER]: 4,
    [Roles.STAFF]: 3,
    [Roles.FACTORYOWNER]: 2,
    [Roles.CUSTOMER]: 1
} as const

export const getRolesBelowOrEqual = (userRole: Roles): Roles[] => {
    const roles = Object.entries(roleHierarchy)
        .filter(([_, level]) => level < roleHierarchy[userRole])
        .map(([role]) => role as Roles)
    return roles
}

export const isRoleHigherThan = (userRole: Roles, targetRole: Roles): boolean => {
    return roleHierarchy[userRole] > roleHierarchy[targetRole]
}

export const isRoleEqualOrHigherThan = (userRole: Roles, targetRole: Roles): boolean => {
    return roleHierarchy[userRole] >= roleHierarchy[targetRole]
}
