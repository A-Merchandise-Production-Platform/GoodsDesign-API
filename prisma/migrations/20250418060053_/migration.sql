/*
  Warnings:

  - Added the required column `systemConfigVariantId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemConfigVariantId` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "systemConfigVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "systemConfigVariantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
