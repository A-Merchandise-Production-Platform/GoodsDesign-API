/*
  Warnings:

  - A unique constraint covering the columns `[productId,minQuantity]` on the table `SystemConfigDiscount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `SystemConfigDiscount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SystemConfigDiscount" ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigDiscount_productId_minQuantity_key" ON "SystemConfigDiscount"("productId", "minQuantity");

-- AddForeignKey
ALTER TABLE "SystemConfigDiscount" ADD CONSTRAINT "SystemConfigDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
