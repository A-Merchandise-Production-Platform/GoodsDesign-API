import { Field, Int, ObjectType, registerEnumType, Float, ID } from "@nestjs/graphql"
import { TaskEntity } from "src/tasks/entities/task.entity"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { Roles } from "@prisma/client"
import { UserEntity } from "../users/entities/users.entity"

export enum ActivityType {
    ORDER = "order",
    FACTORY = "factory",
    STAFF = "staff",
    SYSTEM = "system"
}

registerEnumType(ActivityType, {
    name: "ActivityType",
    description: "The type of dashboard activity"
})

export enum ChangeType {
    POSITIVE = "positive",
    NEGATIVE = "negative"
}

registerEnumType(ChangeType, {
    name: "ChangeType",
    description: "The type of change (positive or negative)"
})

@ObjectType()
class FactoryPerformance {
    @Field()
    factoryId: string

    @Field(() => Int)
    orderCount: number

    @Field(() => Int)
    totalRevenue: number
}

@ObjectType()
class FactoryOrdersByStatus {
    @Field()
    status: string

    @Field(() => Int)
    count: number
}

@ObjectType()
class FactoryInfo {
    @Field()
    id: string

    @Field()
    name: string

    @Field({ nullable: true })
    description: string

    @Field()
    status: string

    @Field(() => UserEntity)
    owner: UserEntity

    @Field(() => Int)
    legitPoint: number

    @Field(() => Int)
    leadTime: number

    @Field(() => Int)
    maxPrintingCapacity: number
}

@ObjectType()
class OrderWithFactory {
    @Field()
    id: string

    @Field()
    status: string

    @Field(() => Int)
    totalPrice: number

    @Field()
    orderDate: Date

    @Field(() => FactoryInfo, { nullable: true })
    factory: FactoryInfo | null
}

@ObjectType()
class CustomerInfo {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    email: string
}

@ObjectType()
class CustomerOrderInfo {
    @Field()
    id: string

    @Field()
    status: string

    @Field(() => Int)
    totalPrice: number

    @Field(() => CustomerInfo)
    customer: CustomerInfo
}

@ObjectType()
class FactoryOrderWithCustomer {
    @Field()
    id: string

    @Field()
    status: string

    @Field(() => Int)
    totalProductionCost: number

    @Field()
    createdAt: Date

    @Field(() => CustomerOrderInfo)
    customerOrder: CustomerOrderInfo
}

@ObjectType()
class FactoryOrderInfo {
    @Field()
    id: string

    @Field()
    status: string

    @Field(() => FactoryInfo)
    factory: FactoryInfo
}

@ObjectType()
class QualityIssueWithFactory {
    @Field()
    id: string

    @Field()
    status: string

    @Field()
    issueType: string

    @Field()
    description: string

    @Field()
    reportedAt: Date

    @Field(() => FactoryOrderInfo)
    factoryOrder: FactoryOrderInfo
}

@ObjectType()
class FactoryProgressReportType {
    @Field()
    id: string

    @Field()
    factoryOrderId: string

    @Field(() => [String])
    photoUrls: string[]

    @Field()
    reportDate: Date

    @Field()
    estimatedCompletion: Date

    @Field()
    notes: string
}

@ObjectType()
class MonthlyRevenue {
    @Field()
    month: string

    @Field(() => Int)
    revenue: number
}

@ObjectType()
class RecentUser {
    @Field(() => ID)
    id: string

    @Field(() => String, { nullable: true })
    name?: string

    @Field(() => String, { nullable: true })
    email?: string

    @Field(() => String, { nullable: true })
    imageUrl?: string

    @Field(() => Roles)
    role: Roles

    @Field(() => Date)
    createdAt: Date
}

@ObjectType()
export class AdminDashboardResponse {
    @Field(() => Int)
    currentMonthRevenue: number

    @Field(() => Int)
    totalRevenue: number

    @Field(() => Int)
    totalActiveUsers: number

    @Field(() => Int)
    totalTemplates: number

    @Field(() => [MonthlyRevenue])
    revenueByMonth: MonthlyRevenue[]

    @Field(() => [RecentUser])
    recentUsers: RecentUser[]
}

@ObjectType()
class FactoryOrderWithProgress extends FactoryOrderWithCustomer {
    @Field(() => [FactoryProgressReportType])
    progressReports: FactoryProgressReportType[]
}

@ObjectType()
class StatValue {
    @Field(() => Int)
    value: number

    @Field(() => Int, { nullable: true })
    percentChange?: number

    @Field({ nullable: true })
    isPositive?: boolean
}

@ObjectType()
class FactoryStats {
    @Field(() => StatValue)
    totalOrders: StatValue

    @Field(() => StatValue)
    monthlyRevenue: StatValue

    @Field(() => StatValue)
    legitPoints: StatValue

    @Field(() => StatValue)
    qualityScore: StatValue
}

@ObjectType()
export class FactoryDashboardResponse {
    @Field(() => FactoryStats)
    stats: FactoryStats

    @Field(() => [MonthlyRevenue])
    revenueData: MonthlyRevenue[]

    @Field(() => Int)
    totalOrders: number

    @Field(() => Int)
    pendingOrders: number

    @Field(() => Int)
    inProductionOrders: number

    @Field(() => Int)
    totalRevenue: number

    @Field(() => [FactoryOrderWithCustomer])
    recentOrders: FactoryOrderWithCustomer[]

    @Field(() => [QualityIssueWithFactory])
    qualityIssues: QualityIssueWithFactory[]

    @Field(() => [FactoryOrderWithProgress])
    productionProgress: FactoryOrderWithProgress[]
}

// New types for Enhanced Manager Dashboard

@ObjectType()
class EnhancedFactoryStats {
    @Field(() => Int)
    total: number

    @Field(() => Int)
    change: number

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedOrderStats {
    @Field(() => Int)
    active: number

    @Field(() => Int)
    change: number

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedStaffStats {
    @Field(() => Int)
    total: number

    @Field(() => Int)
    change: number

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedRevenueStats {
    @Field(() => Int)
    monthly: number

    @Field(() => Float)
    change: number

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class DashboardStats {
    @Field(() => EnhancedFactoryStats)
    factories: EnhancedFactoryStats

    @Field(() => EnhancedOrderStats)
    orders: EnhancedOrderStats

    @Field(() => EnhancedStaffStats)
    staff: EnhancedStaffStats

    @Field(() => EnhancedRevenueStats)
    revenue: EnhancedRevenueStats
}

@ObjectType()
class EnhancedFactoryPerformance {
    @Field()
    factoryId: string

    @Field()
    factoryName: string

    @Field(() => Int)
    orderCount: number

    @Field(() => Int)
    totalRevenue: number
}

@ObjectType()
class OrderStatusDetail {
    @Field()
    status: string

    @Field(() => Int)
    count: number
}

@ObjectType()
class ManagerDashboardStats {
    @Field(() => Int)
    totalFactories: number

    @Field(() => Int)
    totalStaffs: number

    @Field(() => Int)
    monthlyRevenue: number

    @Field(() => [MonthlyRevenue])
    revenueByMonth: MonthlyRevenue[]
}
@ObjectType()
export class ManagerDashboardResponse {
    @Field(() => Int)
    totalOrders: number

    @Field(() => Int)
    pendingFactoryOrders: number

    @Field(() => Int)
    totalRevenue: number

    @Field(() => [FactoryOrdersByStatus])
    factoryOrdersByStatus: FactoryOrdersByStatus[]

    @Field(() => [FactoryOrderWithCustomer])
    recentFactoryOrders: FactoryOrderWithCustomer[]

    @Field(() => [QualityIssueWithFactory])
    qualityIssues: QualityIssueWithFactory[]

    @Field(() => ManagerDashboardStats)
    stats: ManagerDashboardStats

    @Field(() => [TopFactory])
    topFactories: TopFactory[]
}

@ObjectType()
class TopFactory {
    @Field()
    id: string

    @Field()
    name: string

    @Field(() => Int)
    legitPoint: number

    @Field(() => UserEntity)
    owner: UserEntity
}

@ObjectType()
class OrdersByMonth {
    @Field()
    month: string

    @Field(() => Int)
    count: number
}

@ObjectType()
export class FactoryDetailDashboardResponse {
    @Field(() => Int)
    totalOrders: number

    @Field(() => Int)
    lastMonthTotalOrders: number

    @Field(() => Int)
    pendingOrders: number

    @Field(() => Int)
    lastMonthPendingOrders: number

    @Field(() => Int)
    inProductionOrders: number

    @Field(() => Int)
    lastMonthInProductionOrders: number

    @Field(() => Int)
    totalRevenue: number

    @Field(() => Int)
    lastMonthTotalRevenue: number

    @Field(() => [FactoryOrderWithCustomer])
    recentOrders: FactoryOrderWithCustomer[]

    @Field(() => [QualityIssueWithFactory])
    qualityIssues: QualityIssueWithFactory[]

    @Field(() => [FactoryOrderWithProgress])
    productionProgress: FactoryOrderWithProgress[]

    @Field(() => FactoryInfo, { nullable: true })
    factoryInfo: FactoryInfo | null

    @Field(() => [OrdersByMonth])
    ordersByMonth: OrdersByMonth[]
}

@ObjectType()
export class StaffDashboardResponse {
    @Field(() => Int)
    completedTasks: number

    @Field(() => Int)
    lastMonthCompletedTasks: number
    @Field(() => Int)
    totalActiveTasks: number

    @Field(() => Int)
    lastMonthActiveTasks: number
    @Field(() => Int)
    totalTaskHistory: number

    @Field(() => [TaskEntity])
    activeTasks: TaskEntity[]

    @Field(() => [TaskEntity])
    taskHistory: TaskEntity[]
}

@ObjectType()
class MyStaffStatValue {
    @Field(() => Int)
    value: number

    @Field(() => Int)
    percentChange: number

    @Field()
    isPositive: boolean
}

@ObjectType()
class MyStaffStats {
    @Field(() => MyStaffStatValue)
    activeTasks: MyStaffStatValue

    @Field(() => MyStaffStatValue)
    completedTasks: MyStaffStatValue

    @Field(() => MyStaffStatValue)
    pendingOrders: MyStaffStatValue

    @Field(() => MyStaffStatValue)
    deliveredOrders: MyStaffStatValue
}

@ObjectType()
class FactoryDetails {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    address: string

    @Field()
    status: string

    @Field(() => Int)
    productionCapacity: number

    @Field(() => Int)
    leadTime: number
}

@ObjectType()
class RecentOrderInfo {
    @Field()
    id: string

    @Field()
    customer: string

    @Field()
    date: string

    @Field()
    status: string

    @Field(() => Int)
    total: number

    @Field()
    priority: string
}

@ObjectType()
export class MyStaffDashboardResponse {
    @Field(() => MyStaffStats)
    stats: MyStaffStats

    @Field(() => FactoryDetails)
    currentFactory: FactoryDetails

    @Field(() => [RecentOrderInfo])
    recentOrders: RecentOrderInfo[]
}
