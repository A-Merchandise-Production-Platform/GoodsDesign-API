import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FactoryOrderStatus, FactoryStatus, Roles } from '@prisma/client';
import { FactoryService } from 'src/factory/factory.service';
import { PaymentTransactionService } from 'src/payment-transaction/payment-transaction.service';
import { PrismaService } from 'src/prisma';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name)

  constructor(private prisma: PrismaService,
    private paymentTransactionService: PaymentTransactionService,
    private readonly factoryService: FactoryService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) // Mỗi 1 phút
  async checkPaymentTransactionIsNotCompleted() {
    await this.paymentTransactionService.checkPaymentTransactionIsNotCompleted()
  }

  /**
   * Cron job to check orders with PAYMENT_RECEIVED status and assign them to factories
   * Runs every 15 minutes
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  async checkPaymentReveivedOrder(){
    await this.factoryService.checkPaymentReceivedOrderForAssignIntoFactory()
  }


  // @Cron(CronExpression.EVERY_MINUTE) // Mỗi 1 phút
  // async checkExpiredOrders() {
  //   await this.checkAndReassignExpiredOrders();
  // }



  // @Cron('0 */15 * * * *') // Mỗi 15 phút
  // async sendReminders() {
  //   await this.sendReminderNotifications();
  // }

  // @Cron('0 0 */1 * * *') // Mỗi 1 giờ
  // async updateOverdue() {
  //   await this.updateOverdueOrders();
  // }

  // @Cron('0 0 */4 * * *') // Mỗi 4 giờ
  // async updateCapacity() {
  //   await this.updateFactoryCapacity();
  // }

  // @Cron('0 0 0 * * *') // Mỗi ngày lúc 00:00
  // async generateReports() {
  //   await this.generateFactoryPerformanceReport();
  // }

  @Cron('0 */5 * * * *') // Mỗi 5 phút
  async createQualityTasks() {
    // await this.createQualityCheckTasksForCompletedOrders();
  }

  @Cron('0 */10 * * * *') // Mỗi 10 phút
  async assignTasks() {
    // await this.assignPendingTasksToStaff();
  }

  @Cron('0 */30 * * * *') // Mỗi 30 phút
  async checkExpiredTasks() {
    // await this.checkAndUpdateExpiredTasks();
  }

  @Cron('0 0 */2 * * *') // Mỗi 2 giờ
  async processDeliveries() {
    // await this.processCompletedOrdersForDelivery();
  }

  

  

  // 1. Phân phối lại đơn hàng quá hạn chấp nhận
async checkAndReassignExpiredOrders(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: checkAndReassignExpiredOrders');
      
      // Tìm các factory order đã quá hạn chấp nhận
      const expiredOrders = await this.prisma.factoryOrder.findMany({
        where: {
          status: FactoryOrderStatus.PENDING_ACCEPTANCE,
          acceptanceDeadline: { lt: new Date() }
        }
      });
  
      this.logger.verbose(`Found ${expiredOrders.length} expired factory orders`);
  
      for (const order of expiredOrders) {
        try {
        //   await this.reassignOrderToNextFactory(order.id);
          this.logger.verbose(`Successfully reassigned factory order ${order.id}`);
        } catch (error) {
          this.logger.error(`Failed to reassign factory order ${order.id}:`, error);
          
          // Gửi thông báo cho admin nếu không thể phân phối lại
        //   await this.notificationService.sendAdminAlert({
        //     type: 'ORDER_ASSIGNMENT_FAILED',
        //     message: `Không thể phân phối lại đơn hàng ${order.customerOrderId}. Cần xử lý thủ công.`,
        //     orderId: order.customerOrderId
        //   });
        }
      }
    } catch (error) {
      this.logger.error('Error in checkAndReassignExpiredOrders cron job:', error);
    }
  }
  // 2. Gửi thông báo nhắc nhở về deadline sắp tới
  async sendReminderNotifications(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: sendReminderNotifications');
      
      // Tìm các factory order sắp hết hạn chấp nhận (còn 1 giờ)
      const almostExpiredOrders = await this.prisma.factoryOrder.findMany({
        where: {
          status: FactoryOrderStatus.PENDING_ACCEPTANCE,
          acceptanceDeadline: {
            gt: new Date(),
            lt: new Date(Date.now() + 60 * 60 * 1000) // 1 giờ từ bây giờ
          }
        },
        include: {
          factory: true,
          customerOrder: true
        }
      });
  
      this.logger.verbose(`Found ${almostExpiredOrders.length} factory orders nearing acceptance deadline`);
  
      for (const order of almostExpiredOrders) {
        // Gửi thông báo cho factory
        // await this.prisma.factoryNotification.create({
        //   data: {
        //     factoryId: order.factoryId,
        //     title: 'Deadline sắp hết',
        //     content: `Đơn hàng #${order.customerOrder.id} sắp hết hạn chấp nhận. Vui lòng xác nhận hoặc từ chối trong vòng 1 giờ tới.`
        //   }
        // });
      }
  
      // Tìm các factory order sắp hết hạn hoàn thành (còn 1 ngày)
      const almostDueOrders = await this.prisma.factoryOrder.findMany({
        where: {
          status: FactoryOrderStatus.IN_PRODUCTION,
          estimatedCompletionDate: {
            gt: new Date(),
            lt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 ngày từ bây giờ
          }
        },
        include: {
          factory: true,
          customerOrder: true
        }
      });
  
      this.logger.verbose(`Found ${almostDueOrders.length} factory orders nearing completion deadline`);
  
      for (const order of almostDueOrders) {
        // Gửi thông báo cho factory
        // await this.prisma.factoryNotification.create({
        //   data: {
        //     factoryId: order.factoryId,
        //     title: 'Sắp đến hạn hoàn thành',
        //     content: `Đơn hàng #${order.customerOrder.id} cần được hoàn thành trong vòng 24 giờ tới.`
        //   }
        // });
      }
    } catch (error) {
      this.logger.error('Error in sendReminderNotifications cron job:', error);
    }
  }
  
  // 3. Cập nhật trạng thái đơn hàng quá hạn
  async updateOverdueOrders(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: updateOverdueOrders');
      
      // Tìm các factory order đã quá hạn hoàn thành
      const overdueOrders = await this.prisma.factoryOrder.findMany({
        where: {
          status: FactoryOrderStatus.IN_PRODUCTION,
          estimatedCompletionDate: { lt: new Date() }
        },
        include: {
          factory: true,
          customerOrder: true
        }
      });
  
      this.logger.verbose(`Found ${overdueOrders.length} overdue factory orders`);
  
      for (const order of overdueOrders) {
        // Đánh dấu đơn hàng là bị trễ
        await this.prisma.factoryOrder.update({
          where: { id: order.id },
          data: {
            isDelayed: true
          }
        });
  
        // Gửi thông báo cho factory
        // await this.prisma.factoryNotification.create({
        //   data: {
        //     factoryId: order.factoryId,
        //     title: 'Đơn hàng quá hạn',
        //     content: `Đơn hàng #${order.customerOrder.id} đã quá hạn hoàn thành. Vui lòng cập nhật tiến độ và lý do trễ hạn.`
        //   }
        // });
  
        // // Gửi thông báo cho admin/manager
        // await this.notificationService.sendAdminAlert({
        //   type: 'ORDER_OVERDUE',
        //   message: `Đơn hàng #${order.customerOrder.id} tại xưởng ${order.factory.name} đã quá hạn hoàn thành.`,
        //   orderId: order.customerOrder.id
        // });
      }
    } catch (error) {
      this.logger.error('Error in updateOverdueOrders cron job:', error);
    }
  }
  
  // 4. Cập nhật công suất sản xuất của factory
  async updateFactoryCapacity(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: updateFactoryCapacity');
      
      // Lấy tất cả factory có trạng thái APPROVED
      const factories = await this.prisma.factory.findMany({
        where: {
          factoryStatus: FactoryStatus.APPROVED
        },
        include: {
          products: true,
          orders: {
            where: {
              status: { in: [FactoryOrderStatus.ACCEPTED, FactoryOrderStatus.IN_PRODUCTION] }
            },
            include: {
              orderDetails: true
            }
          }
        }
      });
  
      this.logger.verbose(`Updating capacity for ${factories.length} factories`);
  
      for (const factory of factories) {
        // Tính tổng số lượng sản phẩm đang sản xuất theo từng loại sản phẩm
        const productionByBlankVariance = {};
        
        factory.orders.forEach(order => {
          order.orderDetails.forEach(detail => {
            if (!productionByBlankVariance[detail.designId]) {
              productionByBlankVariance[detail.designId] = 0;
            }
            productionByBlankVariance[detail.designId] += detail.quantity - detail.completedQty;
          });
        });
  
        // Cập nhật công suất khả dụng cho từng loại sản phẩm
        for (const factoryProduct of factory.products) {
          const inProductionQuantity = productionByBlankVariance[factoryProduct.systemConfigVariantId] || 0;
          const availableCapacity = Math.max(0, factoryProduct.productionCapacity - inProductionQuantity);
          
          // Cập nhật công suất khả dụng (nếu bạn có trường này)
          // await this.prisma.factoryProduct.update({
          //   where: {
          //     id: factoryProduct.id
          //   },
          //   data: {
          //     availableCapacity: availableCapacity
          //   }
          // });
        }
      }
    } catch (error) {
      this.logger.error('Error in updateFactoryCapacity cron job:', error);
    }
  }
  
  // 5. Tạo báo cáo hiệu suất factory hàng ngày
  async generateFactoryPerformanceReport(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: generateFactoryPerformanceReport');
      
      // Lấy tất cả factory có trạng thái APPROVED
      const factories = await this.prisma.factory.findMany({
        where: {
          factoryStatus: FactoryStatus.APPROVED
        }
      });
  
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      for (const factory of factories) {
        // Đơn hàng hoàn thành hôm nay
        const completedOrders = await this.prisma.factoryOrder.count({
          where: {
            factoryId: factory.factoryOwnerId,
            status: FactoryOrderStatus.COMPLETED,
            completedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });
  
        // Đơn hàng bị từ chối hôm nay
        const rejectedOrders = await this.prisma.factoryOrder.count({
          where: {
            factoryId: factory.factoryOwnerId,
            status: FactoryOrderStatus.REJECTED,
            updatedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });
  
        // Đơn hàng quá hạn hiện tại
        const overdueOrders = await this.prisma.factoryOrder.count({
          where: {
            factoryId: factory.factoryOwnerId,
            status: FactoryOrderStatus.IN_PRODUCTION,
            estimatedCompletionDate: { lt: new Date() }
          }
        });
  
        // Vấn đề chất lượng được báo cáo hôm nay
        const qualityIssues = await this.prisma.qualityIssue.count({
          where: {
            factoryOrder: {
              factoryId: factory.factoryOwnerId
            },
            reportedAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });
  
        // Tạo báo cáo hiệu suất (bạn cần tạo model cho phần này)
        // await this.prisma.factoryPerformanceReport.create({
        //   data: {
        //     factoryId: factory.factoryOwnerId,
        //     date: new Date(),
        //     completedOrders: completedOrders,
        //     rejectedOrders: rejectedOrders,
        //     overdueOrders: overdueOrders,
        //     qualityIssues: qualityIssues,
        //     performanceScore: calculatePerformanceScore(completedOrders, rejectedOrders, overdueOrders, qualityIssues)
        //   }
        // });
      }
    } catch (error) {
      this.logger.error('Error in generateFactoryPerformanceReport cron job:', error);
    }
  }
  
  // 6. Tự động tạo task kiểm tra chất lượng khi đơn hàng hoàn thành
  async createQualityCheckTasksForCompletedOrders(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: createQualityCheckTasksForCompletedOrders');
      
      // Tìm các factory order vừa được đánh dấu hoàn thành nhưng chưa có task kiểm tra chất lượng
    //   const completedOrders = await this.prisma.factoryOrder.findMany({
    //     where: {
    //       status: FactoryOrderStatus.COMPLETED,
    //       // Giả sử bạn có một trường để đánh dấu đã tạo task chưa
    //       qualityCheckTaskCreated: false
    //     }
    //   });
  
    //   this.logger.verbose(`Found ${completedOrders.length} completed orders needing quality check tasks`);
  
    //   for (const order of completedOrders) {
    //     try {
    //       await this.createQualityCheckTask(order.id);
          
    //       // Đánh dấu đã tạo task
    //       await this.prisma.factoryOrder.update({
    //         where: { id: order.id },
    //         data: {
    //           qualityCheckTaskCreated: true
    //         }
    //       });
          
    //       this.logger.verbose(`Created quality check task for factory order ${order.id}`);
    //     } catch (error) {
    //       this.logger.error(`Failed to create quality check task for factory order ${order.id}:`, error);
    //     }
    //   }
    } catch (error) {
      this.logger.error('Error in createQualityCheckTasksForCompletedOrders cron job:', error);
    }
  }
  
  // 7. Tự động gán task cho staff
  async assignPendingTasksToStaff(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: assignPendingTasksToStaff');
      
      // Tìm các task chưa được gán
      const unassignedTasks = await this.prisma.task.findMany({
        where: {
          status: 'UNASSIGNED'
        }
      });
  
      this.logger.verbose(`Found ${unassignedTasks.length} unassigned tasks`);
  
      if (unassignedTasks.length === 0) {
        return;
      }
  
      // Lấy danh sách staff còn khả dụng
      const availableStaff = await this.prisma.user.findMany({
        where: {
          role: Roles.STAFF,
          isActive: true
        },
        include: {
          staffTasks: {
            where: {
              status: { in: ['PENDING', 'IN_PROGRESS'] }
            }
          }
        }
      });
  
      if (availableStaff.length === 0) {
        this.logger.verbose('No available staff to assign tasks');
        return;
      }
  
      // Sắp xếp staff theo số lượng task đang có
      const sortedStaff = availableStaff.sort((a, b) => 
        a.staffTasks.length - b.staffTasks.length
      );
  
      // Phân phối task
      for (const task of unassignedTasks) {
        // Chọn staff có ít việc nhất
        const selectedStaff = sortedStaff[0];
        
        await this.prisma.staffTask.create({
          data: {
            userId: selectedStaff.id,
            taskId: task.id,
            assignedDate: new Date(),
            status: 'PENDING',
            note: `Task được tự động gán bởi hệ thống`
          }
        });
  
        // Cập nhật trạng thái task
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            status: 'ASSIGNED'
          }
        });
  
        // Gửi thông báo cho staff
        await this.prisma.notification.create({
          data: {
            userId: selectedStaff.id,
            title: 'Nhiệm vụ mới được gán',
            content: `Bạn được gán nhiệm vụ mới: ${task.taskname}`,
            url: `/tasks/${task.id}`
          }
        });
  
        // Cập nhật lại số lượng task của staff này
        // selectedStaff.staffTasks.push({});
        
        // Sắp xếp lại danh sách staff
        sortedStaff.sort((a, b) => a.staffTasks.length - b.staffTasks.length);
      }
    } catch (error) {
      this.logger.error('Error in assignPendingTasksToStaff cron job:', error);
    }
  }
  
  // 8. Kiểm tra và đánh dấu task quá hạn
  async checkAndUpdateExpiredTasks(): Promise<void> {
    try {
      this.logger.verbose('Running cron job: checkAndUpdateExpiredTasks');
      
      // Tìm các task đã quá hạn nhưng chưa hoàn thành
      const expiredTasks = await this.prisma.task.findMany({
        where: {
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          expiredTime: { lt: new Date() }
        },
        include: {
          staffTasks: {
            include: {
              user: true
            }
          }
        }
      });
  
      this.logger.verbose(`Found ${expiredTasks.length} expired tasks`);
  
      for (const task of expiredTasks) {
        // Cập nhật trạng thái task
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            status: 'EXPIRED'
          }
        });
  
        // Cập nhật staffTask
        // for (const staffTask of task.staffTasks) {
        //   await this.prisma.staffTask.update({
        //     where: { 
        //       userId_taskId: {
        //         userId: staffTask.userId,
        //         taskId: task.id
        //       }
        //     },
        //     data: {
        //       status: 'UNFINISHED'
        //     }
        //   });
  
        //   // Gửi thông báo cho staff
        //   await this.prisma.notification.create({
        //     data: {
        //       userId: staffTask.userId,
        //       title: 'Nhiệm vụ quá hạn',
        //       content: `Nhiệm vụ "${task.taskname}" đã quá hạn hoàn thành. Vui lòng báo cáo với quản lý.`,
        //       url: `/tasks/${task.id}`
        //     }
        //   });
        // }
  
        // Gửi thông báo cho manager
        // await this.notificationService.sendManagerAlert({
        //   type: 'TASK_EXPIRED',
        //   message: `Task "${task.taskname}" đã quá hạn nhưng chưa hoàn thành.`,
        //   taskId: task.id
        // });
      }
    } catch (error) {
      this.logger.error('Error in checkAndUpdateExpiredTasks cron job:', error);
    }
  }
  
  // 9. Xử lý đơn hàng sau một khoảng thời gian
  // async processCompletedOrdersForDelivery(): Promise<void> {
  //   try {
  //     this.logger.verbose('Running cron job: processCompletedOrdersForDelivery');
      
  //     // Tìm các đơn hàng đã sẵn sàng để giao (tất cả factory orders đã SHIPPED)
  //     const customerOrders = await this.prisma.customerOrder.findMany({
  //       where: {
  //         status: OrderStatus.IN_PRODUCTION
  //       },
  //       include: {
  //         factoryOrder: true
  //       }
  //     });
  
  //     for (const order of customerOrders) {
  //       // Kiểm tra xem tất cả factory orders đã SHIPPED chưa
  //       const allShipped = order.factoryOrder.every(fo => 
  //         fo.status === FactoryOrderStatus.SHIPPED
  //       );
  
  //       if (allShipped) {
  //         // Cập nhật trạng thái đơn hàng
  //         await this.prisma.customerOrder.update({
  //           where: { id: order.id },
  //           data: {
  //             status: OrderStatus.COMPLETED
  //           }
  //         });
  
  //         // Thêm lịch sử đơn hàng
  //         await this.prisma.orderHistory.create({
  //           data: {
  //             orderId: order.id,
  //             status: OrderStatus.COMPLETED.toString(),
  //             timestamp: new Date(),
  //             note: 'Tất cả sản phẩm đã được sản xuất và gửi về kho'
  //           }
  //         });
  
  //         // Tạo task cho staff để chuẩn bị giao hàng
  //         const task = await this.prisma.task.create({
  //           data: {
  //             taskname: `Chuẩn bị giao hàng cho đơn hàng #${order.id}`,
  //             description: `Chuẩn bị đóng gói và giao hàng cho đơn hàng #${order.id}`,
  //             status: 'UNASSIGNED',
  //             startDate: new Date(),
  //             expiredTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 ngày
  //             qualityCheckStatus: 'APPROVED'
  //           }
  //         });
  
  //         // Thông báo cho manager
  //       //   await this.notificationService.sendManagerAlert({
  //       //     type: 'ORDER_READY_FOR_DELIVERY',
  //       //     message: `Đơn hàng #${order.id} đã sẵn sàng để giao cho khách hàng.`,
  //       //     orderId: order.id
  //       //   });
  //       }
  //     }
  //   } catch (error) {
  //     this.logger.error('Error in processCompletedOrdersForDelivery cron job:', error);
  //   }
  // }
}