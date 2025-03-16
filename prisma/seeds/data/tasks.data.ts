interface Task {
  id: string;
  description: string;
  taskname: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate: string; // ISO 8601 format
  expiredTime: string; // ISO 8601 format
  qualityCheckStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

interface TasksData {
  tasks: Task[];
}

export const tasksData: TasksData = {
  tasks: [
    {
      id: "task001",
      description: "Quality check for new t-shirt designs",
      taskname: "T-Shirt QC Review",
      status: "PENDING",
      startDate: "2025-03-15T09:00:00Z",
      expiredTime: "2025-03-16T17:00:00Z",
      qualityCheckStatus: "NOT_STARTED",
    },
    {
      id: "task002",
      description: "Review hoodie production specifications",
      taskname: "Hoodie Spec Review",
      status: "IN_PROGRESS",
      startDate: "2025-03-14T10:00:00Z",
      expiredTime: "2025-03-15T18:00:00Z",
      qualityCheckStatus: "IN_PROGRESS",
    },
  ],
};
