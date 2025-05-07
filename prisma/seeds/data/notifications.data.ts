import { usersData } from "./users.data"

interface NotificationData {
    id: string
    title: string
    content: string
    url?: string
    isRead: boolean
    userId: string
    createdAt: Date
}

export const notificationsData: NotificationData[] = [
    {
        id: "notif001",
        title: "Welcome to GoodsDesign!",
        content:
            "Thank you for joining our platform. We're excited to help you create amazing designs.",
        url: "/dashboard",
        isRead: false,
        userId: usersData.users.find((user) => user.email === "customer@gmail.com")?.id || "",
        createdAt: new Date()
    },
    {
        id: "notif002",
        title: "New Order Received",
        content: "Your order #ORD001 has been received and is being processed.",
        url: "/orders/ORD001",
        isRead: true,
        userId: usersData.users.find((user) => user.email === "customer@gmail.com")?.id || "",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    },
    {
        id: "notif003",
        title: "Factory Assignment",
        content: "A new order has been assigned to your factory.",
        url: "/factory/orders/FO001",
        isRead: false,
        userId: usersData.users.find((user) => user.email === "factory@gmail.com")?.id || "",
        createdAt: new Date()
    },
    {
        id: "notif004",
        title: "System Maintenance",
        content: "System will be under maintenance tomorrow from 2 AM to 4 AM UTC.",
        url: "/announcements",
        isRead: false,
        userId: usersData.users.find((user) => user.email === "admin@gmail.com")?.id || "",
        createdAt: new Date()
    },
    {
        id: "notif005",
        title: "Quality Check Required",
        content: "Please review the quality check for order #ORD002.",
        url: "/staff/tasks/QC001",
        isRead: false,
        userId: usersData.users.find((user) => user.email === "staff@gmail.com")?.id || "",
        createdAt: new Date()
    },
    {
        id: "notif006",
        title: "Payment Received",
        content: "Payment of $500 has been received for order #ORD003.",
        url: "/payments/PAY001",
        isRead: true,
        userId: usersData.users.find((user) => user.email === "manager@gmail.com")?.id || "",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 48 hours ago
    }
]
