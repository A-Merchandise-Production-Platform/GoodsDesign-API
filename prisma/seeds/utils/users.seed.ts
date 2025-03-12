import { PrismaClient, Roles } from "@prisma/client"
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { usersData } from "../data/users.data"

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
}

export const seedUsers = async (prisma: PrismaClient) => {
    const hashedPassword = await hashPassword("123456")

    const users: { [key: string]: any } = {}

    for (const userData of usersData.users) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                email: userData.email,
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                password: hashedPassword
            },
            create: {
                id: uuidv4(),
                email: userData.email,
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                password: hashedPassword,
                gender: userData.gender,
                dateOfBirth: new Date(userData.dateOfBirth),
                imageUrl: userData.imageUrl,
                isActive: userData.isActive,
                role: Roles[userData.role as keyof typeof Roles],
                addresses: {
                    create: [
                        {
                            provinceID: userData.address.provinceID,
                            districtID: userData.address.districtID,
                            wardCode: userData.address.wardCode,
                            street: userData.address.street
                        }
                    ]
                }
            }
        })

        users[userData.role.toLowerCase()] = user
    }

    console.log("Users seeded successfully!")
    return users
}
