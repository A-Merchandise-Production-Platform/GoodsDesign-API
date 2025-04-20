import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { TaskEntity } from "src/tasks/entities/task.entity"

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

    @Field()
    factoryStatus: string
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
export class AdminDashboardResponse {
    @Field(() => Int)
    totalOrders: number

    @Field(() => Int)
    totalFactories: number

    @Field(() => Int)
    totalCustomers: number

    @Field(() => Int)
    totalRevenue: number

    @Field(() => Int)
    pendingOrders: number

    @Field(() => Int)
    activeFactories: number

    @Field(() => [OrderWithFactory])
    recentOrders: OrderWithFactory[]

    @Field(() => [FactoryPerformance])
    factoryPerformance: FactoryPerformance[]
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
}

@ObjectType()
class FactoryOrderWithProgress extends FactoryOrderWithCustomer {
    @Field(() => [FactoryProgressReportType])
    progressReports: FactoryProgressReportType[]
}

@ObjectType()
export class FactoryDashboardResponse {
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

    @Field()
    change: string

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedOrderStats {
    @Field(() => Int)
    active: number

    @Field()
    change: string

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedStaffStats {
    @Field(() => Int)
    total: number

    @Field()
    change: string

    @Field(() => ChangeType)
    changeType: ChangeType
}

@ObjectType()
class EnhancedRevenueStats {
    @Field()
    monthly: string

    @Field()
    change: string

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
export class EnhancedManagerDashboardResponse {
    @Field(() => DashboardStats)
    stats: DashboardStats

    @Field(() => [EnhancedFactoryPerformance])
    factoryPerformance: EnhancedFactoryPerformance[]

    @Field(() => [OrderStatusDetail])
    orderStatus: OrderStatusDetail[]
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
