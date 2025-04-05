import { QualityCheckStatus } from '@prisma/client';

export const checkQualityData = {
  checkQualities: [
    {
      id: 'check001',
      taskId: 'task001',
      orderDetailId: 'detail001',
      factoryOrderDetailId: 'factoryorderdetail001',
      totalChecked: 2,
      passedQuantity: 2,
      failedQuantity: 0,
      status: QualityCheckStatus.APPROVED,
      reworkRequired: false,
      note: 'All items meet quality standards',
      checkedAt: new Date('2023-03-14T15:30:00.000Z'),
      checkedBy: 'staff001',
    },
    {
      id: 'check002',
      taskId: 'task002',
      orderDetailId: 'detail002',
      factoryOrderDetailId: 'factoryorderdetail002',
      totalChecked: 2,
      passedQuantity: 1,
      failedQuantity: 1,
      status: QualityCheckStatus.REJECTED,
      reworkRequired: true,
      note: 'Major quality issues found in one item',
      checkedAt: new Date('2023-03-10T14:20:00.000Z'),
      checkedBy: 'staff001',
    },
  ],
}; 