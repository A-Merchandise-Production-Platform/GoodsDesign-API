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
      status: "PENDING",
      startDate: new Date().toISOString(),
      expiredTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      qualityCheckStatus: QualityCheckStatus.PENDING,
      taskType: "QUALITY_CHECK",
      factoryOrderId: "factoryorder001",
      assignedBy: "manager001",
    },
    {
      id: "task002",
      description: "Verify product specifications",
      taskname: "Product Verification - Hoodie Batch 1",
      status: "IN_PROGRESS",
      startDate: new Date().toISOString(),
      expiredTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      qualityCheckStatus: QualityCheckStatus.PARTIAL_APPROVED,
      taskType: "QUALITY_CHECK",
      factoryOrderId: "factoryorder002",
      assignedBy: "manager001",
    },
    {
      id: "task003",
      description: "Final quality inspection",
      taskname: "Final Inspection - Polo Batch 1",
      status: "PENDING",
      startDate: new Date().toISOString(),
      expiredTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
      qualityCheckStatus: QualityCheckStatus.PENDING,
      taskType: "FINAL_INSPECTION",
      factoryOrderId: "factoryorder003",
      assignedBy: "manager002",
    },
  ],
};
