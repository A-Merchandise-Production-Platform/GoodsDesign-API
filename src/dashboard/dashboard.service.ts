import { Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminDashboardResponse, FactoryDashboardResponse, ManagerDashboardResponse } from './dashboard.types';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard(): Promise<AdminDashboardResponse> {
    const [
      totalOrders,
      totalFactories,
      totalCustomers,
      totalRevenue,
      pendingOrders,
      activeFactories,
      recentOrders,
      factoryPerformance,
    ] = await Promise.all([
      this.prisma.customerOrder.count(),
      this.prisma.factory.count(),
      this.prisma.user.count({ where: { role: Roles.CUSTOMER } }),
      this.prisma.customerOrder.aggregate({
        _sum: { totalPrice: true },
      }),
      this.prisma.customerOrder.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.factory.count({
        where: { factoryStatus: 'APPROVED' },
      }),
      this.prisma.customerOrder.findMany({
        take: 5,
        orderBy: { orderDate: 'desc' },
        include: {
          factoryOrder: {
            include: {
              factory: {
                select: {
                  factoryOwnerId: true,
                  name: true,
                  factoryStatus: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.factoryOrder.groupBy({
        by: ['factoryId'],
        _count: {
          id: true,
        },
        _sum: {
          totalProductionCost: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalOrders,
      totalFactories,
      totalCustomers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      pendingOrders,
      activeFactories,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        orderDate: order.orderDate,
        factory: order.factoryOrder?.[0]?.factory ? {
          id: order.factoryOrder[0].factory.factoryOwnerId,
          name: order.factoryOrder[0].factory.name,
          factoryStatus: order.factoryOrder[0].factory.factoryStatus,
        } : null,
      })),
      factoryPerformance: factoryPerformance.map(perf => ({
        factoryId: perf.factoryId,
        orderCount: perf._count.id,
        totalRevenue: perf._sum.totalProductionCost || 0,
      })),
    };
  }

  async getManagerDashboard(): Promise<ManagerDashboardResponse> {
    const [
      totalOrders,
      pendingFactoryOrders,
      totalRevenue,
      factoryOrdersByStatus,
      recentFactoryOrders,
      qualityIssues,
    ] = await Promise.all([
      this.prisma.factoryOrder.count(),
      this.prisma.factoryOrder.count({
        where: { status: 'PENDING_ACCEPTANCE' },
      }),
      this.prisma.factoryOrder.aggregate({
        _sum: { totalProductionCost: true },
      }),
      this.prisma.factoryOrder.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
      this.prisma.factoryOrder.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customerOrder: {
            include: {
              customer: true,
            },
          },
        },
      }),
      this.prisma.qualityIssue.findMany({
        where: { status: 'REPORTED' },
        take: 5,
        orderBy: { reportedAt: 'desc' },
        include: {
          factoryOrder: {
            include: {
              factory: {
                select: {
                  factoryOwnerId: true,
                  name: true,
                  factoryStatus: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingFactoryOrders,
      totalRevenue: totalRevenue._sum.totalProductionCost || 0,
      factoryOrdersByStatus: factoryOrdersByStatus.map(status => ({
        status: status.status,
        count: status._count.id,
      })),
      recentFactoryOrders: recentFactoryOrders.map(order => ({
        id: order.id,
        status: order.status,
        totalProductionCost: order.totalProductionCost,
        createdAt: order.createdAt,
        customerOrder: {
          id: order.customerOrder.id,
          status: order.customerOrder.status,
          totalPrice: order.customerOrder.totalPrice,
          customer: {
            id: order.customerOrder.customer.id,
            name: order.customerOrder.customer.name,
            email: order.customerOrder.customer.email,
          },
        },
      })),
      qualityIssues: qualityIssues.map(issue => ({
        id: issue.id,
        status: issue.status,
        issueType: issue.issueType,
        description: issue.description,
        reportedAt: issue.reportedAt,
        factoryOrder: {
          id: issue.factoryOrder.id,
          status: issue.factoryOrder.status,
          factory: {
            id: issue.factoryOrder.factory.factoryOwnerId,
            name: issue.factoryOrder.factory.name,
            factoryStatus: issue.factoryOrder.factory.factoryStatus,
          },
        },
      })),
    };
  }

  async getFactoryDashboard(factoryId: string): Promise<FactoryDashboardResponse> {
    const [
      totalOrders,
      pendingOrders,
      inProductionOrders,
      totalRevenue,
      recentOrders,
      qualityIssues,
      productionProgress,
    ] = await Promise.all([
      this.prisma.factoryOrder.count({
        where: { factoryId },
      }),
      this.prisma.factoryOrder.count({
        where: { factoryId, status: 'PENDING_ACCEPTANCE' },
      }),
      this.prisma.factoryOrder.count({
        where: { factoryId, status: 'IN_PRODUCTION' },
      }),
      this.prisma.factoryOrder.aggregate({
        where: { factoryId },
        _sum: { totalProductionCost: true },
      }),
      this.prisma.factoryOrder.findMany({
        where: { factoryId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customerOrder: {
            include: {
              customer: true,
            },
          },
        },
      }),
      this.prisma.qualityIssue.findMany({
        where: { factoryOrder: { factoryId }, status: 'REPORTED' },
        take: 5,
        orderBy: { reportedAt: 'desc' },
        include: {
          factoryOrder: {
            include: {
              factory: {
                select: {
                  factoryOwnerId: true,
                  name: true,
                  factoryStatus: true,
                },
              },
              customerOrder: {
                include: {
                  customer: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.factoryOrder.findMany({
        where: { factoryId, status: 'IN_PRODUCTION' },
        include: {
          customerOrder: {
            include: {
              customer: true,
            },
          },
          progressReports: {
            orderBy: { reportDate: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    const factory = await this.prisma.factory.findUnique({
      where: { factoryOwnerId: factoryId },
      select: {
        name: true,
        factoryStatus: true,
      },
    });

    return {
      totalOrders,
      pendingOrders,
      inProductionOrders,
      totalRevenue: totalRevenue._sum.totalProductionCost || 0,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        status: order.status,
        totalProductionCost: order.totalProductionCost,
        createdAt: order.createdAt,
        customerOrder: {
          id: order.customerOrder.id,
          status: order.customerOrder.status,
          totalPrice: order.customerOrder.totalPrice,
          customer: {
            id: order.customerOrder.customer.id,
            name: order.customerOrder.customer.name,
            email: order.customerOrder.customer.email,
          },
        },
      })),
      qualityIssues: qualityIssues.map(issue => ({
        id: issue.id,
        status: issue.status,
        issueType: issue.issueType,
        description: issue.description,
        reportedAt: issue.reportedAt,
        factoryOrder: {
          id: issue.factoryOrder.id,
          status: issue.factoryOrder.status,
          factory: {
            id: issue.factoryOrder.factory.factoryOwnerId,
            name: issue.factoryOrder.factory.name,
            factoryStatus: issue.factoryOrder.factory.factoryStatus,
          },
        },
      })),
      productionProgress: productionProgress.map(order => ({
        id: order.id,
        status: order.status,
        totalProductionCost: order.totalProductionCost,
        createdAt: order.createdAt,
        customerOrder: {
          id: order.customerOrder.id,
          status: order.customerOrder.status,
          totalPrice: order.customerOrder.totalPrice,
          customer: {
            id: order.customerOrder.customer.id,
            name: order.customerOrder.customer.name,
            email: order.customerOrder.customer.email,
          },
        },
        progressReports: order.progressReports,
      })),
    };
  }
} 