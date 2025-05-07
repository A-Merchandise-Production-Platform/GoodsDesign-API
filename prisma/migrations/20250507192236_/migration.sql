/*
  Warnings:

  - A unique constraint covering the columns `[voucherId,userId]` on the table `VoucherUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_voucherId_key";

-- CreateIndex
CREATE UNIQUE INDEX "VoucherUsage_voucherId_userId_key" ON "VoucherUsage"("voucherId", "userId");
