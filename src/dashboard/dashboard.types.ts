import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class FactoryPerformance {
  @Field()
  factoryId: string;

  @Field(() => Int)
  orderCount: number;

  @Field(() => Int)
  totalRevenue: number;
}

@ObjectType()
class FactoryOrdersByStatus {
  @Field()
  status: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
class FactoryInfo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  factoryStatus: string;
}

@ObjectType()
class OrderWithFactory {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => Int)
  totalPrice: number;

  @Field()
  orderDate: Date;

  @Field(() => FactoryInfo, { nullable: true })
  factory: FactoryInfo | null;
}

@ObjectType()
class CustomerInfo {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
class CustomerOrderInfo {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => Int)
  totalPrice: number;

  @Field(() => CustomerInfo)
  customer: CustomerInfo;
}

@ObjectType()
class FactoryOrderWithCustomer {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => Int)
  totalProductionCost: number;

  @Field()
  createdAt: Date;

  @Field(() => CustomerOrderInfo)
  customerOrder: CustomerOrderInfo;
}

@ObjectType()
class FactoryOrderInfo {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field(() => FactoryInfo)
  factory: FactoryInfo;
}

@ObjectType()
class QualityIssueWithFactory {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field()
  issueType: string;

  @Field()
  description: string;

  @Field()
  reportedAt: Date;

  @Field(() => FactoryOrderInfo)
  factoryOrder: FactoryOrderInfo;
}

@ObjectType()
class FactoryProgressReportType {
  @Field()
  id: string;

  @Field()
  factoryOrderId: string;

  @Field(() => [String])
  photoUrls: string[];

  @Field()
  reportDate: Date;

  @Field()
  estimatedCompletion: Date;

  @Field()
  notes: string;
}

@ObjectType()
export class AdminDashboardResponse {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  totalFactories: number;

  @Field(() => Int)
  totalCustomers: number;

  @Field(() => Int)
  totalRevenue: number;

  @Field(() => Int)
  pendingOrders: number;

  @Field(() => Int)
  activeFactories: number;

  @Field(() => [OrderWithFactory])
  recentOrders: OrderWithFactory[];

  @Field(() => [FactoryPerformance])
  factoryPerformance: FactoryPerformance[];
}

@ObjectType()
export class ManagerDashboardResponse {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  pendingFactoryOrders: number;

  @Field(() => Int)
  totalRevenue: number;

  @Field(() => [FactoryOrdersByStatus])
  factoryOrdersByStatus: FactoryOrdersByStatus[];

  @Field(() => [FactoryOrderWithCustomer])
  recentFactoryOrders: FactoryOrderWithCustomer[];

  @Field(() => [QualityIssueWithFactory])
  qualityIssues: QualityIssueWithFactory[];
}

@ObjectType()
class FactoryOrderWithProgress extends FactoryOrderWithCustomer {
  @Field(() => [FactoryProgressReportType])
  progressReports: FactoryProgressReportType[];
}

@ObjectType()
export class FactoryDashboardResponse {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  pendingOrders: number;

  @Field(() => Int)
  inProductionOrders: number;

  @Field(() => Int)
  totalRevenue: number;

  @Field(() => [FactoryOrderWithCustomer])
  recentOrders: FactoryOrderWithCustomer[];

  @Field(() => [QualityIssueWithFactory])
  qualityIssues: QualityIssueWithFactory[];

  @Field(() => [FactoryOrderWithProgress])
  productionProgress: FactoryOrderWithProgress[];
} 