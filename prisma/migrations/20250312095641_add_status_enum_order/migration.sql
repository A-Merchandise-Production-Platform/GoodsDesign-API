/*
  Warnings:

  - Changed the type of `status` on the `CustomerOrderDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `qualityCheckStatus` on the `CustomerOrderDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reworkStatus` on the `CustomerOrderDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `CustomerOrders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PRODUCTION', 'COMPLETED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "QualityCheckStatus" AS ENUM ('PENDING', 'PARTIAL_APPROVED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReworkStatus" AS ENUM ('NOT_REQUIRED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "CustomerOrderDetails" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL,
DROP COLUMN "qualityCheckStatus",
ADD COLUMN     "qualityCheckStatus" "QualityCheckStatus" NOT NULL,
DROP COLUMN "reworkStatus",
ADD COLUMN     "reworkStatus" "ReworkStatus" NOT NULL;

-- AlterTable
ALTER TABLE "CustomerOrders" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;
