/*
  Warnings:

  - You are about to drop the column `address` on the `Factory` table. All the data in the column will be lost.
  - You are about to drop the column `primaryPrintingMethods` on the `Factory` table. All the data in the column will be lost.
  - You are about to drop the column `yearEstablished` on the `Factory` table. All the data in the column will be lost.
  - The `specializations` column on the `Factory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[addressId]` on the table `Factory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishedDate` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Made the column `totalEmployees` on table `Factory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxPrintingCapacity` on table `Factory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operationalHours` on table `Factory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minimumOrderQuantity` on table `Factory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "factoryId" TEXT;

-- AlterTable
ALTER TABLE "Factory" DROP COLUMN "address",
DROP COLUMN "primaryPrintingMethods",
DROP COLUMN "yearEstablished",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "establishedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "printingMethods" TEXT[],
ALTER COLUMN "totalEmployees" SET NOT NULL,
ALTER COLUMN "maxPrintingCapacity" SET NOT NULL,
DROP COLUMN "specializations",
ADD COLUMN     "specializations" TEXT[],
ALTER COLUMN "operationalHours" SET NOT NULL,
ALTER COLUMN "minimumOrderQuantity" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Factory_addressId_key" ON "Factory"("addressId");

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
