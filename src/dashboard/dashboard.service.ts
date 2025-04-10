import { ForbiddenException, Injectable } from "@nestjs/common"
import { OrderStatus, Roles } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import {
    ActivityType,
    AdminDashboardResponse,
    ChangeType,
    EnhancedManagerDashboardResponse,
    FactoryDashboardResponse,
    ManagerDashboardResponse
} from "./dashboard.types"
import { UserEntity } from "src/users"
import { ManagerOrderDashboardEntity } from "src/dashboard/entity/manager-order.entity"

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getAdminDashboard(userId: string): Promise<AdminDashboardResponse> {
        // Implementation would go here
        return {
            totalOrders: 0,
            totalFactories: 0,
            totalCustomers: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            activeFactories: 0,
            recentOrders: [],
            factoryPerformance: []
        }
    }

    async getManagerDashboard(userId: string): Promise<ManagerDashboardResponse> {
        // Implementation would go here
        return {
            totalOrders: 0,
            pendingFactoryOrders: 0,
            totalRevenue: 0,
            factoryOrdersByStatus: [],
            recentFactoryOrders: [],
            qualityIssues: []
        }
    }

    async getEnhancedManagerDashboard(userId: string): Promise<EnhancedManagerDashboardResponse> {
        try {
            // Get current date info for time-based comparisons
            const today = new Date()
            const currentMonth = today.getMonth()
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
            const currentYear = today.getFullYear()
            const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

            // Dates for current and previous month calculations
            const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
            const startOfPreviousMonth = new Date(
                previousMonth === 11 ? previousYear : currentYear,
                previousMonth,
                1
            )

            // 1. Factory Stats
            const [currentFactoriesCount, previousFactoriesCount] = await Promise.all([
                this.prisma.factory.count({
                    where: {
                        factoryStatus: { not: "REJECTED" },
                        establishedDate: { lte: today }
                    }
                }),
                this.prisma.factory.count({
                    where: {
                        factoryStatus: { not: "REJECTED" },
                        establishedDate: { lte: startOfCurrentMonth }
                    }
                })
            ])

            const factoriesChange = currentFactoriesCount - previousFactoriesCount
            const factoriesChangeType =
                factoriesChange >= 0 ? ChangeType.POSITIVE : ChangeType.NEGATIVE

            // 2. Active Orders
            const [currentActiveOrders, previousActiveOrders] = await Promise.all([
                this.prisma.order.count({
                    where: {
                        orderDate: { lte: today },
                        status: {
                            in: [
                                OrderStatus.PENDING,
                                OrderStatus.PAYMENT_RECEIVED,
                                OrderStatus.WAITING_FILL_INFORMATION,
                                OrderStatus.NEED_MANAGER_HANDLE,
                                OrderStatus.PENDING_ACCEPTANCE,
                                OrderStatus.IN_PRODUCTION,
                                OrderStatus.WAITING_FOR_CHECKING_QUALITY
                            ]
                        }
                    }
                }),
                this.prisma.order.count({
                    where: {
                        orderDate: { lte: startOfCurrentMonth },
                        status: {
                            in: [
                                OrderStatus.PENDING,
                                OrderStatus.PAYMENT_RECEIVED,
                                OrderStatus.WAITING_FILL_INFORMATION,
                                OrderStatus.NEED_MANAGER_HANDLE,
                                OrderStatus.PENDING_ACCEPTANCE,
                                OrderStatus.IN_PRODUCTION,
                                OrderStatus.WAITING_FOR_CHECKING_QUALITY
                            ]
                        }
                    }
                })
            ])

            const ordersChange = currentActiveOrders - previousActiveOrders
            const ordersChangePercent =
                previousActiveOrders > 0
                    ? Math.round((ordersChange / previousActiveOrders) * 100)
                    : 0
            const ordersChangeType = ordersChange >= 0 ? ChangeType.POSITIVE : ChangeType.NEGATIVE

            // 3. Staff Members
            const [currentStaffCount, previousStaffCount] = await Promise.all([
                this.prisma.user.count({
                    where: {
                        role: { in: ["STAFF", "FACTORYOWNER"] },
                        createdAt: { lte: today },
                        isDeleted: false
                    }
                }),
                this.prisma.user.count({
                    where: {
                        role: { in: ["STAFF", "FACTORYOWNER"] },
                        createdAt: { lte: startOfCurrentMonth },
                        isDeleted: false
                    }
                })
            ])

            const staffChange = currentStaffCount - previousStaffCount
            const staffChangeType = staffChange >= 0 ? ChangeType.POSITIVE : ChangeType.NEGATIVE

            // 4. Monthly Revenue
            const [currentMonthRevenue, previousMonthRevenue] = await Promise.all([
                this.prisma.paymentTransaction.aggregate({
                    _sum: { amount: true },
                    where: {
                        createdAt: {
                            gte: startOfCurrentMonth,
                            lte: today
                        },
                        status: "COMPLETED",
                        type: "PAYMENT"
                    }
                }),
                this.prisma.paymentTransaction.aggregate({
                    _sum: { amount: true },
                    where: {
                        createdAt: {
                            gte: startOfPreviousMonth,
                            lt: startOfCurrentMonth
                        },
                        status: "COMPLETED",
                        type: "PAYMENT"
                    }
                })
            ])

            const currentRevenue = currentMonthRevenue._sum.amount || 0
            const previousRevenue = previousMonthRevenue._sum.amount || 0
            const revenueChange = currentRevenue - previousRevenue
            const revenueChangePercent =
                previousRevenue > 0
                    ? Number(((revenueChange / previousRevenue) * 100).toFixed(1))
                    : 0
            const revenueChangeType = revenueChange >= 0 ? ChangeType.POSITIVE : ChangeType.NEGATIVE

            // 5. Factory Performance
            const factories = await this.prisma.factory.findMany({
                select: {
                    factoryOwnerId: true,
                    name: true
                },
                where: {
                    factoryStatus: "APPROVED"
                },
                take: 5
            })

            // We need to get orders for each factory
            const factoryPerformanceData = await Promise.all(
                factories.map(async (factory) => {
                    const orders = await this.prisma.order.findMany({
                        where: {
                            factoryId: factory.factoryOwnerId,
                            orderDate: {
                                gte: startOfCurrentMonth,
                                lte: today
                            }
                        },
                        select: {
                            totalProductionCost: true
                        }
                    })

                    return {
                        factoryId: factory.factoryOwnerId,
                        factoryName: factory.name,
                        orderCount: orders.length,
                        totalRevenue: orders.reduce(
                            (sum, order) => sum + (order.totalProductionCost || 0),
                            0
                        )
                    }
                })
            )

            // Sort by order count
            factoryPerformanceData.sort((a, b) => b.orderCount - a.orderCount)

            // 6. Order Status Distribution
            const orderStatuses = await this.prisma.order.groupBy({
                by: ["status"],
                _count: {
                    _all: true
                }
            })

            return {
                stats: {
                    factories: {
                        total: currentFactoriesCount,
                        change:
                            factoriesChange > 0
                                ? `+${factoriesChange}`
                                : factoriesChange.toString(),
                        changeType: factoriesChangeType
                    },
                    orders: {
                        active: currentActiveOrders,
                        change:
                            ordersChangePercent > 0
                                ? `+${ordersChangePercent}%`
                                : `${ordersChangePercent}%`,
                        changeType: ordersChangeType
                    },
                    staff: {
                        total: currentStaffCount,
                        change: staffChange > 0 ? `+${staffChange}` : staffChange.toString(),
                        changeType: staffChangeType
                    },
                    revenue: {
                        monthly: `$${currentRevenue.toLocaleString()}`,
                        change:
                            revenueChangePercent > 0
                                ? `+${revenueChangePercent}%`
                                : `${revenueChangePercent}%`,
                        changeType: revenueChangeType
                    }
                },
                factoryPerformance: factoryPerformanceData,
                orderStatus: orderStatuses.map((status) => ({
                    status: status.status,
                    count: status._count._all
                }))
            }
        } catch (error) {
            console.error("Error fetching enhanced dashboard data:", error)
            // Fallback to mock data in case of error
            return this.getMockDashboardData()
        }
    }

    private getRelativeTimeString(date: Date): string {
        const now = new Date()
        const diffInMilliseconds = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
        }
    }

    private getMockDashboardData(): EnhancedManagerDashboardResponse {
        return {
            stats: {
                factories: {
                    total: 12,
                    change: "+2",
                    changeType: ChangeType.POSITIVE
                },
                orders: {
                    active: 148,
                    change: "+14%",
                    changeType: ChangeType.POSITIVE
                },
                staff: {
                    total: 63,
                    change: "-2",
                    changeType: ChangeType.NEGATIVE
                },
                revenue: {
                    monthly: "$182,450",
                    change: "+8.2%",
                    changeType: ChangeType.POSITIVE
                }
            },
            factoryPerformance: [
                {
                    factoryId: "F1001",
                    factoryName: "Shanghai Plant",
                    orderCount: 45,
                    totalRevenue: 125000
                },
                {
                    factoryId: "F1002",
                    factoryName: "Delhi Facility",
                    orderCount: 32,
                    totalRevenue: 98000
                },
                {
                    factoryId: "F1003",
                    factoryName: "Mexico City",
                    orderCount: 28,
                    totalRevenue: 85000
                },
                {
                    factoryId: "F1004",
                    factoryName: "Detroit Hub",
                    orderCount: 60,
                    totalRevenue: 150000
                },
                {
                    factoryId: "F1005",
                    factoryName: "Berlin Plant",
                    orderCount: 25,
                    totalRevenue: 72000
                }
            ],
            orderStatus: [
                { status: "Completed", count: 85 },
                { status: "In Progress", count: 45 },
                { status: "Pending", count: 30 },
                { status: "Cancelled", count: 15 }
            ]
        }
    }

    async getManagerOrderDashboard(user: UserEntity) {
        if (user.role !== Roles.MANAGER) {
            throw new ForbiddenException("You are not authorized to access this resource")
        }

        const currentMonthOrders = await this.prisma.order.findMany({
            where: {
                orderDate: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        })

        const lastMonthOrders = await this.prisma.order.findMany({
            where: {
                orderDate: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
                }
            }
        })

        const currentMonthPendingOrders = currentMonthOrders.filter(
            (order) => order.status === OrderStatus.PENDING
        )

        const lastMonthPendingOrders = lastMonthOrders.filter(
            (order) => order.status === OrderStatus.PENDING
        )

        const inProductionOrders = currentMonthOrders.filter(
            (order) => order.status === OrderStatus.IN_PRODUCTION
        )

        const lastMonthInProductionOrders = lastMonthOrders.filter(
            (order) => order.status === OrderStatus.IN_PRODUCTION
        )

        const completedOrders = currentMonthOrders.filter(
            (order) => order.status === OrderStatus.COMPLETED
        )

        const lastMonthCompletedOrders = lastMonthOrders.filter(
            (order) => order.status === OrderStatus.COMPLETED
        )

        return new ManagerOrderDashboardEntity({
            totalOrders: currentMonthOrders.length,
            lastMonthOrders: lastMonthOrders.length,
            pendingOrders: currentMonthPendingOrders.length,
            lastMonthPendingOrders: lastMonthPendingOrders.length,
            inProductionOrders: inProductionOrders.length,
            lastMonthInProductionOrders: lastMonthInProductionOrders.length,
            completedOrders: completedOrders.length,
            lastMonthCompletedOrders: lastMonthCompletedOrders.length
        })
    }

    async getFactoryDashboard(userId: string): Promise<FactoryDashboardResponse> {
        // Implementation would go here
        return {
            totalOrders: 0,
            pendingOrders: 0,
            inProductionOrders: 0,
            totalRevenue: 0,
            recentOrders: [],
            qualityIssues: [],
            productionProgress: []
        }
    }
}
