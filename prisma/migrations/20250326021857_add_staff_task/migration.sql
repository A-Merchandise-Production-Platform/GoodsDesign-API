/*
  Warnings:

  - Added the required column `acceptanceDeadline` to the `FactoryOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedAt` to the `FactoryOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerOrderId` to the `FactoryOrder` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `FactoryOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `price` to the `FactoryOrderDetail` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `FactoryOrderDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FactoryOrderStatus" AS ENUM ('PENDING_ACCEPTANCE', 'ACCEPTED', 'EXPIRED', 'REJECTED', 'IN_PRODUCTION', 'COMPLETED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QualityIssueStatus" AS ENUM ('REPORTED', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'ASSIGNED_TO_FACTORY';

-- AlterTable
ALTER TABLE "CustomerOrder" ADD COLUMN     "ratedAt" TIMESTAMP(3),
ADD COLUMN     "ratedBy" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "ratingComment" TEXT;

-- AlterTable
ALTER TABLE "FactoryOrder" ADD COLUMN     "acceptanceDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "currentProgress" INTEGER,
ADD COLUMN     "customerOrderId" TEXT NOT NULL,
ADD COLUMN     "delayReason" TEXT,
ADD COLUMN     "isDelayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUpdated" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "shippedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "FactoryOrderStatus" NOT NULL,
ALTER COLUMN "estimatedCompletionDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FactoryOrderDetail" ADD COLUMN     "completedQty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "rejectedQty" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- CreateTable
CREATE TABLE "FactoryProgressReport" (
    "id" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedQty" INTEGER NOT NULL,
    "estimatedCompletion" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "photoUrls" TEXT[],

    CONSTRAINT "FactoryProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityIssue" (
    "id" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportedBy" TEXT,
    "assignedTo" TEXT,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "status" "QualityIssueStatus" NOT NULL,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "QualityIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_customerOrderId_fkey" FOREIGN KEY ("customerOrderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProgressReport" ADD CONSTRAINT "FactoryProgressReport_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
