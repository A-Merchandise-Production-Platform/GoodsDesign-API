/*
  Warnings:

  - You are about to drop the column `factoryOrderDetailId` on the `CheckQuality` table. All the data in the column will be lost.
  - You are about to drop the column `factoryOrderId` on the `QualityIssue` table. All the data in the column will be lost.
  - You are about to drop the column `factoryOrderId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `CustomerOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerOrderDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryOrderDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryProgressReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RejectedFactoryOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `QualityIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'PENDING_ACCEPTANCE';
ALTER TYPE "OrderStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "OrderStatus" ADD VALUE 'REJECTED';
ALTER TYPE "OrderStatus" ADD VALUE 'WAITING_FOR_MANAGER_ASSIGN_FACTORY';
ALTER TYPE "OrderStatus" ADD VALUE 'WAITING_FOR_CHECKING_QUALITY';
ALTER TYPE "OrderStatus" ADD VALUE 'DONE_CHECK_QUALITY';
ALTER TYPE "OrderStatus" ADD VALUE 'REWORK_REQUIRED';
ALTER TYPE "OrderStatus" ADD VALUE 'REWORK_COMPLETED';
ALTER TYPE "OrderStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "OrderStatus" ADD VALUE 'SHIPPED';
ALTER TYPE "OrderStatus" ADD VALUE 'WAITING_FOR_MANAGER_ASSIGN_STAFF';

-- DropForeignKey
ALTER TABLE "CheckQuality" DROP CONSTRAINT "CheckQuality_factoryOrderDetailId_fkey";

-- DropForeignKey
ALTER TABLE "CheckQuality" DROP CONSTRAINT "CheckQuality_orderDetailId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrder" DROP CONSTRAINT "CustomerOrder_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrderDetail" DROP CONSTRAINT "CustomerOrderDetail_designId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrderDetail" DROP CONSTRAINT "CustomerOrderDetail_orderId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrder" DROP CONSTRAINT "FactoryOrder_customerOrderId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrder" DROP CONSTRAINT "FactoryOrder_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetail" DROP CONSTRAINT "FactoryOrderDetail_designId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetail" DROP CONSTRAINT "FactoryOrderDetail_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetail" DROP CONSTRAINT "FactoryOrderDetail_orderDetailId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryProgressReport" DROP CONSTRAINT "FactoryProgressReport_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderHistory" DROP CONSTRAINT "OrderHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "QualityIssue" DROP CONSTRAINT "QualityIssue_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedFactoryOrders" DROP CONSTRAINT "RejectedFactoryOrders_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "RejectedFactoryOrders" DROP CONSTRAINT "RejectedFactoryOrders_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_factoryOrderId_fkey";

-- AlterTable
ALTER TABLE "CheckQuality" DROP COLUMN "factoryOrderDetailId";

-- AlterTable
ALTER TABLE "QualityIssue" DROP COLUMN "factoryOrderId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "factoryOrderId",
ADD COLUMN     "orderId" TEXT;

-- DropTable
DROP TABLE "CustomerOrder";

-- DropTable
DROP TABLE "CustomerOrderDetail";

-- DropTable
DROP TABLE "FactoryOrder";

-- DropTable
DROP TABLE "FactoryOrderDetail";

-- DropTable
DROP TABLE "FactoryProgressReport";

-- DropTable
DROP TABLE "RejectedFactoryOrders";

-- DropEnum
DROP TYPE "FactoryOrderStatus";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "factoryId" TEXT,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER NOT NULL,
    "depositPaid" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),
    "acceptanceDeadline" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "estimatedCompletionDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "totalItems" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "totalProductionCost" INTEGER,
    "lastUpdated" TIMESTAMP(3),
    "currentProgress" INTEGER,
    "delayReason" TEXT,
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "ratingComment" TEXT,
    "ratedAt" TIMESTAMP(3),
    "ratedBy" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderDetailStatus" NOT NULL,
    "completedQty" INTEGER NOT NULL DEFAULT 0,
    "rejectedQty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productionCost" INTEGER,
    "isRework" BOOLEAN NOT NULL DEFAULT false,
    "qualityStatus" "QualityCheckStatus",
    "qualityCheckedAt" TIMESTAMP(3),
    "qualityCheckedBy" TEXT,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProgressReport" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" INTEGER,
    "estimatedCompletion" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "photoUrls" TEXT[],

    CONSTRAINT "OrderProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedOrders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reassignedTo" TEXT,
    "reassignedAt" TIMESTAMP(3),

    CONSTRAINT "RejectedOrders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProgressReport" ADD CONSTRAINT "OrderProgressReport_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedOrders" ADD CONSTRAINT "RejectedOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedOrders" ADD CONSTRAINT "RejectedOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "OrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
