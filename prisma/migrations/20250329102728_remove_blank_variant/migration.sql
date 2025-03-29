/*
  Warnings:

  - You are about to drop the column `blankVarianceId` on the `FactoryProduct` table. All the data in the column will be lost.
  - You are about to drop the column `blankVariantId` on the `ProductDesign` table. All the data in the column will be lost.
  - You are about to drop the `BlankVariances` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `systemConfigVariantId` to the `FactoryProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemConfigVariantId` to the `ProductDesign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlankVariances" DROP CONSTRAINT "BlankVariances_productId_fkey";

-- DropForeignKey
ALTER TABLE "BlankVariances" DROP CONSTRAINT "BlankVariances_systemVariantId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryProduct" DROP CONSTRAINT "FactoryProduct_blankVarianceId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDesign" DROP CONSTRAINT "ProductDesign_blankVariantId_fkey";

-- AlterTable
ALTER TABLE "FactoryProduct" DROP COLUMN "blankVarianceId",
ADD COLUMN     "systemConfigVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductDesign" DROP COLUMN "blankVariantId",
ADD COLUMN     "systemConfigVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemConfigVariant" ADD COLUMN     "price" INTEGER;

-- DropTable
DROP TABLE "BlankVariances";

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
