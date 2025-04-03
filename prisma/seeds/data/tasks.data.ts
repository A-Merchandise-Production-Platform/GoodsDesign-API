import { QualityCheckStatus } from '@prisma/client';

interface Task {
  id: string;
  description: string;
  taskname: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate: string; // ISO 8601 format
  expiredTime: string; // ISO 8601 format
  qualityCheckStatus: QualityCheckStatus;
  taskType: string;
  factoryOrderId: string;
  assignedBy: string;
}

interface TasksData {
  tasks: Task[];
}

export const tasksData: TasksData = {
  tasks: [
    {
      id: "task001",
      description: "Check quality of T-shirt production batch",
      taskname: "Quality Check - T-shirt Batch 1",
      status: "COMPLETED",
      startDate: new Date('2023-03-01T08:00:00.000Z').toISOString(),
      expiredTime: new Date('2023-03-15T17:00:00.000Z').toISOString(),
      qualityCheckStatus: QualityCheckStatus.APPROVED,
      taskType: "QUALITY_CHECK",
      factoryOrderId: "factoryorder001",
      assignedBy: "manager001",
    },
    {
      id: "task002",
      description: "Verify product specifications",
      taskname: "Product Verification - Hoodie Batch 1",
      status: "IN_PROGRESS",
      startDate: new Date('2023-03-05T09:00:00.000Z').toISOString(),
      expiredTime: new Date('2023-03-20T17:00:00.000Z').toISOString(),
      qualityCheckStatus: QualityCheckStatus.REJECTED,
      taskType: "QUALITY_CHECK",
      factoryOrderId: "factoryorder002",
      assignedBy: "manager001",
    },
    {
      id: "task003",
      description: "Final quality inspection",
      taskname: "Final Inspection - Polo Batch 1",
      status: "PENDING",
      startDate: new Date('2023-03-10T10:00:00.000Z').toISOString(),
      expiredTime: new Date('2023-03-25T17:00:00.000Z').toISOString(),
      qualityCheckStatus: QualityCheckStatus.PENDING,
      taskType: "FINAL_INSPECTION",
      factoryOrderId: "factoryorder003",
      assignedBy: "manager002",
    },
  ],
};
