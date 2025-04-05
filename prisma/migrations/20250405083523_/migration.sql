/*
  Warnings:

  - You are about to drop the column `qualityCheckStatus` on the `CustomerOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `reworkStatus` on the `CustomerOrderDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerOrderDetail" DROP COLUMN "qualityCheckStatus",
DROP COLUMN "reworkStatus";

-- DropEnum
DROP TYPE "ReworkStatus";
