/*
  Warnings:

  - You are about to drop the column `information` on the `BlankVariances` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SystemConfigVariant` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `SystemConfigVariant` table. All the data in the column will be lost.
  - Added the required column `systemVariantId` to the `BlankVariances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlankVariances" DROP COLUMN "information",
ADD COLUMN     "systemVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemConfigVariant" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "size" TEXT;

-- AddForeignKey
ALTER TABLE "BlankVariances" ADD CONSTRAINT "BlankVariances_systemVariantId_fkey" FOREIGN KEY ("systemVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
