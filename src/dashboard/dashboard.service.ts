import { ForbiddenException, Injectable } from "@nestjs/common"
import { OrderStatus, Roles } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import {
    ActivityType,
    AdminDashboardResponse,
    ChangeType,
    FactoryDashboardResponse,
    FactoryDetailDashboardResponse,
    ManagerDashboardResponse,
    MyStaffDashboardResponse,
    StaffDashboardResponse
} from "./dashboard.types"
import { UserEntity } from "src/users"
import { ManagerOrderDashboardEntity } from "src/dashboard/entity/manager-order.entity"

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getAdminDashboard(userId: string): Promise<AdminDashboardResponse> {
        try {
            // Get current date info
            const today = new Date()
            const currentMonth = today.getMonth()
            const currentYear = today.getFullYear()
            const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)

            // 1. Current month revenue from completed orders
            const currentMonthOrders = await this.prisma.order.findMany({
                where: {
                    orderDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    },
                    status: "COMPLETED"
                }
            })
            const currentMonthRevenue = currentMonthOrders.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
            )

            // 2. Total all-time revenue from completed orders
            const allCompletedOrders = await this.prisma.order.findMany({
                where: {
                    status: "COMPLETED"
                }
            })
            const totalRevenue = allCompletedOrders.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
            )

            // 3. Total active users
            const totalActiveUsers = await this.prisma.user.count({
                where: {
                    isDeleted: false,
                    isActive: true
                }
            })

            // 4. Total templates (products)
            const totalTemplates = await this.prisma.productDesign.count({
                where: {
                    isTemplate: true,
                    isDeleted: false
                }
            })

            // 5. Revenue by last 12 months
            const revenueByMonth = []
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]

            // Get revenue for last 12 months from completed orders
            for (let i = 11; i >= 0; i--) {
                const targetMonth = new Date()
                targetMonth.setMonth(targetMonth.getMonth() - i)

                const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
                const endOfMonth = new Date(
                    targetMonth.getFullYear(),
                    targetMonth.getMonth() + 1,
                    0,
                    23,
                    59,
                    59
                )

                const monthOrders = await this.prisma.order.findMany({
                    where: {
                        orderDate: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        },
                        status: "COMPLETED"
                    }
                })

                const monthlyRevenue = monthOrders.reduce(
                    (sum, order) => sum + (order.totalPrice || 0),
                    0
                )

                revenueByMonth.push({
                    month: `${months[targetMonth.getMonth()]} `,
                    revenue: monthlyRevenue
                })
            }

            // 6. Get 10 latest users
            const recentUsers = await this.prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                where: {
                    isDeleted: false
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                    role: true,
                    createdAt: true
                }
            })

            return {
                currentMonthRevenue,
                totalRevenue,
                totalActiveUsers,
                totalTemplates,
                revenueByMonth,
                recentUsers
            }
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error)
            // Return empty data in case of error
            return {
                currentMonthRevenue: 0,
                totalRevenue: 0,
                totalActiveUsers: 0,
                totalTemplates: 0,
                revenueByMonth: [],
                recentUsers: []
            }
        }
    }

    async getManagerDashboard(userId: string): Promise<ManagerDashboardResponse> {
        try {
            // Get current date info
            const today = new Date()
            const currentMonth = today.getMonth()
            const currentYear = today.getFullYear()
            const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)

            // 1. Total Factories
            const totalFactories = await this.prisma.factory.count({
                where: {
                    factoryStatus: { not: "REJECTED" }
                }
            })

            // 2. Total Orders
            const totalOrders = await this.prisma.order.count()

            // 3. Total Staffs
            const totalStaffs = await this.prisma.user.count({
                where: {
                    role: { in: ["STAFF", "FACTORYOWNER"] },
                    isDeleted: false
                }
            })

            // 4. Monthly Revenue
            const currentMonthOrders = await this.prisma.order.findMany({
                where: {
                    orderDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    },
                    status: "COMPLETED"
                }
            })
            const monthlyRevenue = currentMonthOrders.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
            )

            // 5. Order Status Distribution
            const orderStatuses = await this.prisma.order.groupBy({
                by: ["status"],
                _count: {
                    _all: true
                }
            })

            const totalOrderCount = orderStatuses.reduce(
                (sum, status) => sum + status._count._all,
                0
            )
            const factoryOrdersByStatus = orderStatuses.map((status) => ({
                status: status.status,
                count: status._count._all,
                percent:
                    totalOrderCount > 0
                        ? Math.round((status._count._all / totalOrderCount) * 100)
                        : 0
            }))

            // 6. Revenue by last 12 months
            const revenueByMonth = []
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]

            for (let i = 11; i >= 0; i--) {
                const targetMonth = new Date()
                targetMonth.setMonth(targetMonth.getMonth() - i)

                const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
                const endOfMonth = new Date(
                    targetMonth.getFullYear(),
                    targetMonth.getMonth() + 1,
                    0,
                    23,
                    59,
                    59
                )

                const monthOrders = await this.prisma.order.findMany({
                    where: {
                        orderDate: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        },
                        status: "COMPLETED"
                    }
                })

                const monthlyRevenue = monthOrders.reduce(
                    (sum, order) => sum + (order.totalPrice || 0),
                    0
                )

                revenueByMonth.push({
                    month: months[targetMonth.getMonth()],
                    revenue: monthlyRevenue
                })
            }

            // 7. Latest 10 Orders
            const recentFactoryOrders = await this.prisma.order.findMany({
                take: 10,
                orderBy: {
                    orderDate: "desc"
                },
                include: {
                    customer: true
                }
            })

            // 8. Top Tier Factories
            const topFactories = await this.prisma.factory.findMany({
                where: {
                    factoryStatus: "APPROVED"
                },
                orderBy: [{ legitPoint: "desc" }, { name: "asc" }],
                take: 5,
                include: {
                    owner: true
                }
            })

            return {
                totalOrders,
                pendingFactoryOrders:
                    factoryOrdersByStatus.find((s) => s.status === "PENDING")?.count || 0,
                totalRevenue: monthlyRevenue,
                factoryOrdersByStatus,
                recentFactoryOrders: recentFactoryOrders.map((order) => ({
                    id: order.id,
                    status: order.status,
                    totalProductionCost: order.totalProductionCost || 0,
                    createdAt: order.orderDate,
                    customerOrder: {
                        id: order.id,
                        status: order.status,
                        totalPrice: order.totalPrice || 0,
                        customer: {
                            id: order.customer.id,
                            name: order.customer.name || order.customer.email,
                            email: order.customer.email
                        }
                    }
                })),
                qualityIssues: [],
                stats: {
                    totalFactories,
                    totalStaffs,
                    monthlyRevenue,
                    revenueByMonth
                },
                topFactories: topFactories.map((factory) => ({
                    id: factory.factoryOwnerId,
                    name: factory.name,
                    legitPoint: factory.legitPoint || 0,
                    owner: factory.owner
                }))
            }
        } catch (error) {
            console.error("Error fetching manager dashboard data:", error)
            return {
                totalOrders: 0,
                pendingFactoryOrders: 0,
                totalRevenue: 0,
                factoryOrdersByStatus: [],
                recentFactoryOrders: [],
                qualityIssues: [],
                stats: {
                    totalFactories: 0,
                    totalStaffs: 0,
                    monthlyRevenue: 0,
                    revenueByMonth: []
                },
                topFactories: []
            }
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

    async getMyFactoryDashboard(userId: string): Promise<FactoryDashboardResponse> {
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

            // Check if the user is a factory owner
            const factory = await this.prisma.factory.findFirst({
                where: { factoryOwnerId: userId }
            })

            if (!factory) {
                throw new ForbiddenException("Factory not found for this user")
            }

            // Get orders for current month
            const currentMonthOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: userId,
                    orderDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    }
                }
            })

            // Get orders for previous month
            const previousMonthOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: userId,
                    orderDate: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            // Total orders stats
            const totalOrders = currentMonthOrders.length
            const previousTotalOrders = previousMonthOrders.length
            const totalOrdersPercentChange =
                previousTotalOrders > 0
                    ? Math.round(((totalOrders - previousTotalOrders) / previousTotalOrders) * 100)
                    : 0

            // Monthly revenue stats
            const monthlyRevenue = currentMonthOrders.reduce(
                (sum, order) => sum + (order.totalProductionCost || 0),
                0
            )
            const previousMonthlyRevenue = previousMonthOrders.reduce(
                (sum, order) => sum + (order.totalProductionCost || 0),
                0
            )
            const monthlyRevenuePercentChange =
                previousMonthlyRevenue > 0
                    ? Math.round(
                          ((monthlyRevenue - previousMonthlyRevenue) / previousMonthlyRevenue) * 100
                      )
                    : 0

            // Get orders with quality checks
            const orderIds = currentMonthOrders.map((order) => order.id)
            const previousOrderIds = previousMonthOrders.map((order) => order.id)

            // Get all order details for these orders
            const orderDetails = await this.prisma.orderDetail.findMany({
                where: {
                    orderId: { in: orderIds }
                },
                select: {
                    id: true
                }
            })

            const previousOrderDetails = await this.prisma.orderDetail.findMany({
                where: {
                    orderId: { in: previousOrderIds }
                },
                select: {
                    id: true
                }
            })

            const orderDetailIds = orderDetails.map((detail) => detail.id)
            const previousOrderDetailIds = previousOrderDetails.map((detail) => detail.id)

            // Get quality checks for current month
            const qualityChecks = await this.prisma.checkQuality.findMany({
                where: {
                    orderDetailId: { in: orderDetailIds },
                    createdAt: {
                        gte: startOfCurrentMonth,
                        lte: today
                    }
                }
            })

            const previousQualityChecks = await this.prisma.checkQuality.findMany({
                where: {
                    orderDetailId: { in: previousOrderDetailIds },
                    createdAt: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            // Calculate quality score - based on pass/fail ratio
            const calculateScore = (checks) => {
                if (checks.length === 0) return 98 // Default if no checks

                const totalChecked = checks.reduce((sum, check) => sum + check.totalChecked, 0)
                const totalPassed = checks.reduce((sum, check) => sum + check.passedQuantity, 0)

                if (totalChecked === 0) return 98 // Default if no items checked
                return Math.round((totalPassed / totalChecked) * 100)
            }

            const qualityScore = calculateScore(qualityChecks)
            const previousQualityScore = calculateScore(previousQualityChecks)

            const qualityScorePercentChange =
                previousQualityScore > 0
                    ? Math.round(
                          ((qualityScore - previousQualityScore) / previousQualityScore) * 100
                      )
                    : 0

            // Generate monthly revenue data for the past 7 months
            const revenueData = []
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]

            for (let i = 6; i >= 0; i--) {
                const targetMonth = new Date()
                targetMonth.setMonth(targetMonth.getMonth() - i)

                const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
                const endOfMonth = new Date(
                    targetMonth.getFullYear(),
                    targetMonth.getMonth() + 1,
                    0
                )

                const monthOrders = await this.prisma.order.findMany({
                    where: {
                        factoryId: userId,
                        orderDate: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        }
                    }
                })

                const monthRevenue = monthOrders.reduce(
                    (sum, order) => sum + (order.totalProductionCost || 0),
                    0
                )

                revenueData.push({
                    month: months[targetMonth.getMonth()],
                    revenue: monthRevenue
                })
            }

            return {
                stats: {
                    totalOrders: {
                        value: totalOrders,
                        percentChange: totalOrdersPercentChange,
                        isPositive: totalOrdersPercentChange >= 0
                    },
                    monthlyRevenue: {
                        value: monthlyRevenue,
                        percentChange: monthlyRevenuePercentChange,
                        isPositive: monthlyRevenuePercentChange >= 0
                    },
                    legitPoints: {
                        value: factory.legitPoint || 100
                    },
                    qualityScore: {
                        value: qualityScore,
                        percentChange: qualityScorePercentChange,
                        isPositive: qualityScorePercentChange >= 0
                    }
                },
                revenueData: revenueData.map((data) => ({
                    month: data.month,
                    revenue: data.revenue
                })),
                totalOrders,
                pendingOrders: currentMonthOrders.filter(
                    (order) =>
                        order.status === OrderStatus.PENDING ||
                        order.status === OrderStatus.PENDING_ACCEPTANCE ||
                        order.status === OrderStatus.NEED_MANAGER_HANDLE
                ).length,
                inProductionOrders: currentMonthOrders.filter(
                    (order) => order.status === OrderStatus.IN_PRODUCTION
                ).length,
                totalRevenue: monthlyRevenue,
                recentOrders: [],
                qualityIssues: [],
                productionProgress: []
            }
        } catch (error) {
            console.error("Error fetching factory dashboard data:", error)
            // Return placeholder data in case of error
            return {
                stats: {
                    totalOrders: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    },
                    monthlyRevenue: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    },
                    legitPoints: {
                        value: 0
                    },
                    qualityScore: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    }
                },
                revenueData: [],
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

    async getFactoryDetailDashboard(factoryId: string): Promise<FactoryDetailDashboardResponse> {
        if (!factoryId) {
            throw new ForbiddenException("Factory ID is required")
        }

        try {
            // Check if factory exists
            const factory = await this.prisma.factory.findUnique({
                where: { factoryOwnerId: factoryId },
                include: {
                    owner: true
                }
            })

            if (!factory) {
                throw new ForbiddenException(`Factory with ID ${factoryId} not found`)
            }

            // Get current date info
            const today = new Date()
            const currentMonth = today.getMonth()
            const currentYear = today.getFullYear()
            const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)

            // 1. Get all orders for this factory
            const allOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: factoryId
                }
            })

            // 2. Calculate total orders and revenue
            const totalOrders = allOrders.length
            const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

            // 3. Calculate current month revenue
            const currentMonthOrders = allOrders.filter(
                (order) => order.orderDate >= startOfCurrentMonth && order.orderDate <= today
            )
            const currentMonthRevenue = currentMonthOrders.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
            )

            // 4. Get orders by month for the last 12 months
            const ordersByMonth = []
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]

            for (let i = 11; i >= 0; i--) {
                const targetMonth = new Date()
                targetMonth.setMonth(targetMonth.getMonth() - i)

                const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
                const endOfMonth = new Date(
                    targetMonth.getFullYear(),
                    targetMonth.getMonth() + 1,
                    0,
                    23,
                    59,
                    59
                )

                const monthOrders = allOrders.filter(
                    (order) => order.orderDate >= startOfMonth && order.orderDate <= endOfMonth
                )

                ordersByMonth.push({
                    month: months[targetMonth.getMonth()],
                    count: monthOrders.length
                })
            }

            // 5. Get recent orders
            const recentOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: factoryId
                },
                orderBy: {
                    orderDate: "desc"
                },
                take: 10,
                include: {
                    customer: true
                }
            })

            return {
                totalOrders,
                lastMonthTotalOrders: 0, // Not needed in new implementation
                pendingOrders: allOrders.filter((order) => order.status === "PENDING").length,
                lastMonthPendingOrders: 0, // Not needed in new implementation
                inProductionOrders: allOrders.filter((order) => order.status === "IN_PRODUCTION")
                    .length,
                lastMonthInProductionOrders: 0, // Not needed in new implementation
                totalRevenue,
                lastMonthTotalRevenue: 0, // Not needed in new implementation
                recentOrders: recentOrders.map((order) => ({
                    id: order.id,
                    status: order.status,
                    totalProductionCost: order.totalProductionCost || 0,
                    createdAt: order.orderDate,
                    customerOrder: {
                        id: order.id,
                        status: order.status,
                        totalPrice: order.totalPrice || 0,
                        customer: {
                            id: order.customer.id,
                            name: order.customer.name || order.customer.email,
                            email: order.customer.email
                        }
                    }
                })),
                qualityIssues: [],
                productionProgress: [],
                factoryInfo: {
                    id: factory.factoryOwnerId,
                    name: factory.name,
                    description: factory.description || "",
                    status: factory.factoryStatus,
                    owner: factory.owner,
                    legitPoint: factory.legitPoint || 0,
                    leadTime: factory.leadTime || 0,
                    maxPrintingCapacity: factory.maxPrintingCapacity || 0
                },
                ordersByMonth
            }
        } catch (error) {
            console.error(`Error fetching factory detail dashboard for ${factoryId}:`, error)
            return {
                totalOrders: 0,
                lastMonthTotalOrders: 0,
                pendingOrders: 0,
                lastMonthPendingOrders: 0,
                inProductionOrders: 0,
                lastMonthInProductionOrders: 0,
                totalRevenue: 0,
                lastMonthTotalRevenue: 0,
                recentOrders: [],
                qualityIssues: [],
                productionProgress: [],
                factoryInfo: null,
                ordersByMonth: []
            }
        }
    }

    async getStaffDashboard(userId: string): Promise<StaffDashboardResponse> {
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

        // Get completed tasks for current month
        const completedTasksCurrentMonth = await this.prisma.task.count({
            where: {
                userId: userId,
                status: "COMPLETED",
                completedDate: {
                    gte: startOfCurrentMonth,
                    lte: today
                }
            }
        })

        // Get completed tasks for previous month
        const completedTasksPreviousMonth = await this.prisma.task.count({
            where: {
                userId: userId,
                status: "COMPLETED",
                completedDate: {
                    gte: startOfPreviousMonth,
                    lt: startOfCurrentMonth
                }
            }
        })

        // Get active tasks
        const activeTasks = await this.prisma.task.findMany({
            where: {
                userId: userId,
                status: { in: ["PENDING", "IN_PROGRESS"] }
            },
            orderBy: [
                { status: "asc" }, // IN_PROGRESS first, then PENDING
                { expiredTime: "asc" } // Closest deadline first
            ],
            include: {
                order: true,
                assignee: true
            }
        })

        // Get current month active tasks count
        const activeTasksCurrentMonth = await this.prisma.task.count({
            where: {
                userId: userId,
                status: { in: ["PENDING", "IN_PROGRESS"] },
                startDate: {
                    gte: startOfCurrentMonth,
                    lte: today
                }
            }
        })

        // Get previous month active tasks count
        const activeTasksPreviousMonth = await this.prisma.task.count({
            where: {
                userId: userId,
                status: { in: ["PENDING", "IN_PROGRESS"] },
                startDate: {
                    gte: startOfPreviousMonth,
                    lt: startOfCurrentMonth
                }
            }
        })

        // Get task history (recently completed tasks)
        const taskHistory = await this.prisma.task.findMany({
            where: {
                userId: userId,
                status: "COMPLETED"
            },
            orderBy: {
                completedDate: "desc"
            },
            take: 10,
            include: {
                order: true,
                assignee: true
            }
        })

        // Total task history count
        const totalTaskHistory = await this.prisma.task.count({
            where: {
                userId: userId,
                status: "COMPLETED"
            }
        })

        return {
            completedTasks: completedTasksCurrentMonth,
            lastMonthCompletedTasks: completedTasksPreviousMonth,
            totalActiveTasks: activeTasks.length,
            lastMonthActiveTasks: activeTasksPreviousMonth,
            totalTaskHistory: totalTaskHistory,
            activeTasks: activeTasks,
            taskHistory: taskHistory
        }
    }

    async getMyStaffDashboard(userId: string): Promise<MyStaffDashboardResponse> {
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

            // Get the staff user
            const staffUser = await this.prisma.user.findUnique({
                where: { id: userId }
            })

            if (!staffUser) {
                throw new ForbiddenException("Staff user not found")
            }

            // Check if staff is assigned to a factory
            const factory = await this.prisma.factory.findFirst({
                where: {
                    staffId: userId
                }
            })

            if (!factory) {
                throw new ForbiddenException("Staff is not assigned to any factory")
            }

            // Get active tasks for current month
            const currentMonthTasks = await this.prisma.task.count({
                where: {
                    userId: userId,
                    status: { in: ["PENDING", "IN_PROGRESS"] },
                    startDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    }
                }
            })

            // Get active tasks for previous month
            const previousMonthTasks = await this.prisma.task.count({
                where: {
                    userId: userId,
                    status: { in: ["PENDING", "IN_PROGRESS"] },
                    startDate: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            // Active tasks stats
            const activeTasksPercentChange =
                previousMonthTasks > 0
                    ? Math.round(
                          ((currentMonthTasks - previousMonthTasks) / previousMonthTasks) * 100
                      )
                    : 0

            // Get completed tasks for current month
            const currentMonthCompletedTasks = await this.prisma.task.count({
                where: {
                    userId: userId,
                    status: "COMPLETED",
                    completedDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    }
                }
            })

            // Get completed tasks for previous month
            const previousMonthCompletedTasks = await this.prisma.task.count({
                where: {
                    userId: userId,
                    status: "COMPLETED",
                    completedDate: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            // Completed tasks stats
            const completedTasksPercentChange =
                previousMonthCompletedTasks > 0
                    ? Math.round(
                          ((currentMonthCompletedTasks - previousMonthCompletedTasks) /
                              previousMonthCompletedTasks) *
                              100
                      )
                    : 0

            // Get orders for factory
            const factoryOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: factory.factoryOwnerId,
                    orderDate: {
                        gte: startOfCurrentMonth,
                        lte: today
                    }
                }
            })

            const previousFactoryOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: factory.factoryOwnerId,
                    orderDate: {
                        gte: startOfPreviousMonth,
                        lt: startOfCurrentMonth
                    }
                }
            })

            // Pending orders
            const pendingOrders = factoryOrders.filter(
                (order) =>
                    order.status === OrderStatus.PENDING ||
                    order.status === OrderStatus.PENDING_ACCEPTANCE ||
                    order.status === OrderStatus.NEED_MANAGER_HANDLE
            ).length

            const previousPendingOrders = previousFactoryOrders.filter(
                (order) =>
                    order.status === OrderStatus.PENDING ||
                    order.status === OrderStatus.PENDING_ACCEPTANCE ||
                    order.status === OrderStatus.NEED_MANAGER_HANDLE
            ).length

            const pendingOrdersPercentChange =
                previousPendingOrders > 0
                    ? Math.round(
                          ((pendingOrders - previousPendingOrders) / previousPendingOrders) * 100
                      )
                    : 0

            // Delivered orders
            const deliveredOrders = factoryOrders.filter(
                (order) => order.status === OrderStatus.COMPLETED
            ).length

            const previousDeliveredOrders = previousFactoryOrders.filter(
                (order) => order.status === OrderStatus.COMPLETED
            ).length

            const deliveredOrdersPercentChange =
                previousDeliveredOrders > 0
                    ? Math.round(
                          ((deliveredOrders - previousDeliveredOrders) / previousDeliveredOrders) *
                              100
                      )
                    : 0

            // Get recent orders with customer details
            const recentOrders = await this.prisma.order.findMany({
                where: {
                    factoryId: factory.factoryOwnerId
                },
                orderBy: {
                    orderDate: "desc"
                },
                take: 5,
                include: {
                    customer: true
                }
            })

            // Map recent orders to required format
            const formattedRecentOrders = recentOrders.map((order) => {
                // Determine priority based on status or other criteria
                let priority = "Normal"
                if (order.status === OrderStatus.NEED_MANAGER_HANDLE) {
                    priority = "High"
                } else if (
                    new Date(order.orderDate).getTime() + 7 * 24 * 60 * 60 * 1000 <
                    today.getTime()
                ) {
                    // If order is more than 7 days old
                    priority = "Overdue"
                }

                return {
                    id: order.id,
                    customer: order.customer ? order.customer.name : "Unknown",
                    date: order.orderDate.toISOString().split("T")[0],
                    status: order.status,
                    total: order.totalPrice || 0,
                    priority: priority
                }
            })

            // For address, use a simple version or placeholder since we don't have proper address details
            const address = `Factory Location #${factory.factoryOwnerId.substring(0, 8)}`

            return {
                stats: {
                    activeTasks: {
                        value: currentMonthTasks,
                        percentChange: activeTasksPercentChange,
                        isPositive: activeTasksPercentChange >= 0
                    },
                    completedTasks: {
                        value: currentMonthCompletedTasks,
                        percentChange: completedTasksPercentChange,
                        isPositive: completedTasksPercentChange >= 0
                    },
                    pendingOrders: {
                        value: pendingOrders,
                        percentChange: pendingOrdersPercentChange,
                        isPositive: pendingOrdersPercentChange < 0
                    },
                    deliveredOrders: {
                        value: deliveredOrders,
                        percentChange: deliveredOrdersPercentChange,
                        isPositive: deliveredOrdersPercentChange >= 0
                    }
                },
                currentFactory: {
                    id: factory.factoryOwnerId,
                    name: factory.name,
                    address: address,
                    status: factory.factoryStatus,
                    productionCapacity: factory.maxPrintingCapacity || 0,
                    leadTime: factory.leadTime || 0
                },
                recentOrders: formattedRecentOrders.map((order) => ({
                    ...order,
                    total: order.total || 0
                }))
            }
        } catch (error) {
            console.error("Error fetching staff dashboard data:", error)
            // Return placeholder data in case of error
            return {
                stats: {
                    activeTasks: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    },
                    completedTasks: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    },
                    pendingOrders: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    },
                    deliveredOrders: {
                        value: 0,
                        percentChange: 0,
                        isPositive: true
                    }
                },
                currentFactory: {
                    id: "",
                    name: "Not assigned",
                    address: "N/A",
                    status: "N/A",
                    productionCapacity: 0,
                    leadTime: 0
                },
                recentOrders: []
            }
        }
    }

    async getSystemRevenue(): Promise<number> {
        const orders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.COMPLETED
            }
        })

        return orders.reduce((total, order) => total + (order.totalPrice || 0), 0)
    }

    async getCurrentMonthCompletedOrdersRevenue(): Promise<number> {
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        const orders = await this.prisma.order.findMany({
            where: {
                status: OrderStatus.COMPLETED,
                orderDate: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        })

        return orders.reduce((total, order) => total + (order.totalPrice || 0), 0)
    }
}
