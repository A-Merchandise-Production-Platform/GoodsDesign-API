/*
  Warnings:

  - The values [REJECTED,REWORK_COMPLETED] on the enum `OrderDetailStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ASSIGNED_TO_FACTORY,ACCEPTED,DONE_PRODUCTION,DELIVERED,EXPIRED,WAITING_FOR_MANAGER_ASSIGN_FACTORY,REWORK_COMPLETED,WAITING_FOR_MANAGER_ASSIGN_STAFF] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reworkRequired` on the `CheckQuality` table. All the data in the column will be lost.
  - You are about to drop the column `qualityCheckedAt` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `qualityCheckedBy` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `qualityStatus` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `OrderProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCompletion` on the `OrderProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `qualityCheckStatus` on the `Task` table. All the data in the column will be lost.
  - The `taskType` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `OrderHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QualityIssue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RejectedOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'NEED_ASSIGN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('QUALITY_CHECK');

-- CreateEnum
CREATE TYPE "OrderSystemConfigType" AS ENUM ('ORDER_SYSTEM_CONFIG');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderDetailStatus_new" AS ENUM ('PENDING', 'IN_PRODUCTION', 'DONE_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'DONE_CHECK_QUALITY', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'REWORK_DONE', 'READY_FOR_SHIPPING', 'SHIPPED', 'COMPLETED');
ALTER TABLE "OrderDetail" ALTER COLUMN "status" TYPE "OrderDetailStatus_new" USING ("status"::text::"OrderDetailStatus_new");
ALTER TYPE "OrderDetailStatus" RENAME TO "OrderDetailStatus_old";
ALTER TYPE "OrderDetailStatus_new" RENAME TO "OrderDetailStatus";
DROP TYPE "OrderDetailStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'WAITING_FILL_INFORMATION', 'NEED_ASSIGN', 'PENDING_ACCEPTANCE', 'REJECTED', 'IN_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'DONE_CHECK_QUALITY', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'WAITING_PAYMENT', 'READY_FOR_SHIPPING', 'SHIPPED', 'COMPLETED', 'CANCELED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "OrderHistory" DROP CONSTRAINT "OrderHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "QualityIssue" DROP CONSTRAINT "QualityIssue_orderId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedOrders" DROP CONSTRAINT "RejectedOrders_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedOrders" DROP CONSTRAINT "RejectedOrders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "StaffTask" DROP CONSTRAINT "StaffTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "StaffTask" DROP CONSTRAINT "StaffTask_userId_fkey";

-- AlterTable
ALTER TABLE "CheckQuality" DROP COLUMN "reworkRequired",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "totalChecked" SET DEFAULT 0,
ALTER COLUMN "passedQuantity" SET DEFAULT 0,
ALTER COLUMN "failedQuantity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancellationDate" TIMESTAMP(3),
ADD COLUMN     "customerNotes" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "estimatedShippingDate" TIMESTAMP(3),
ADD COLUMN     "priorityLevel" INTEGER;

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "qualityCheckedAt",
DROP COLUMN "qualityCheckedBy",
DROP COLUMN "qualityStatus";

-- AlterTable
ALTER TABLE "OrderProgressReport" DROP COLUMN "completed",
DROP COLUMN "estimatedCompletion";

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "productionTimeInHours" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedBy",
DROP COLUMN "qualityCheckStatus",
ADD COLUMN     "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "completedDate" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT,
DROP COLUMN "taskType",
ADD COLUMN     "taskType" "TaskType" NOT NULL DEFAULT 'QUALITY_CHECK';

-- DropTable
DROP TABLE "OrderHistory";

-- DropTable
DROP TABLE "QualityIssue";

-- DropTable
DROP TABLE "RejectedOrders";

-- DropTable
DROP TABLE "StaffTask";

-- DropEnum
DROP TYPE "QualityIssueStatus";

-- DropEnum
DROP TYPE "StaffTaskStatus";

-- CreateTable
CREATE TABLE "RejectedOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reassignedTo" TEXT,
    "reassignedAt" TIMESTAMP(3),

    CONSTRAINT "RejectedOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigOrder" (
    "id" TEXT NOT NULL,
    "type" "OrderSystemConfigType" NOT NULL DEFAULT 'ORDER_SYSTEM_CONFIG',
    "limitFactoryRejectOrders" INTEGER NOT NULL DEFAULT 3,
    "checkQualityTimesDays" INTEGER NOT NULL DEFAULT 2,
    "limitReworkTimes" INTEGER NOT NULL DEFAULT 2,
    "shippingDays" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "SystemConfigOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigOrder_type_key" ON "SystemConfigOrder"("type");

-- AddForeignKey
ALTER TABLE "RejectedOrder" ADD CONSTRAINT "RejectedOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedOrder" ADD CONSTRAINT "RejectedOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
