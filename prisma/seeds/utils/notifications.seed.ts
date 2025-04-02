import { PrismaClient } from "@prisma/client"
import { notificationsData } from "../data/notifications.data"

export async function seedNotifications(prisma: PrismaClient) {
    console.log("Seeding notifications...")

    for (const notification of notificationsData) {
        await prisma.notification.create({
            data: notification
        })
    }

    console.log("Notifications seeded successfully!")
}
