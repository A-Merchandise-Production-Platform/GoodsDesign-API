/*
  Warnings:

  - The `status` column on the `FactoryOrderDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `CustomerOrderDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderDetailStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED', 'QUALITY_CHECK_PENDING', 'QUALITY_CHECK_PASSED', 'QUALITY_CHECK_FAILED', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'REWORK_COMPLETED', 'SHIPPED');

-- AlterTable
ALTER TABLE "CustomerOrderDetail" DROP COLUMN "status",
ADD COLUMN     "status" "OrderDetailStatus" NOT NULL;

-- AlterTable
ALTER TABLE "FactoryOrderDetail" DROP COLUMN "status",
ADD COLUMN     "status" "OrderDetailStatus" NOT NULL DEFAULT 'PENDING';
