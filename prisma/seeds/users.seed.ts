import { PrismaClient, Roles } from "@prisma/client"
import * as bcrypt from "bcrypt"
import * as fs from "fs"
import * as path from "path"
import { v4 as uuidv4 } from "uuid"

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
}

export const seedUsers = async (prisma: PrismaClient) => {
    const usersFilePath = path.join(__dirname, "users-data.seed.json")
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"))

    const hashedPassword = await hashPassword("123456")

    const users: { [key: string]: any } = {}

    for (const userData of usersData) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
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
