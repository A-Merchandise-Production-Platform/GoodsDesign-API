/*
  Warnings:

  - Changed the type of `status` on the `CheckQuality` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `qualityCheckStatus` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CheckQuality" ADD COLUMN     "checkedBy" TEXT,
ADD COLUMN     "factoryOrderDetailId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "QualityCheckStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedBy" TEXT,
ADD COLUMN     "factoryOrderId" TEXT,
ADD COLUMN     "taskType" TEXT,
DROP COLUMN "qualityCheckStatus",
ADD COLUMN     "qualityCheckStatus" "QualityCheckStatus" NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_factoryOrderDetailId_fkey" FOREIGN KEY ("factoryOrderDetailId") REFERENCES "FactoryOrderDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
