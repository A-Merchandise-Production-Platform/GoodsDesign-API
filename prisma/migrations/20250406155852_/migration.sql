/*
  Warnings:

  - The `type` column on the `SystemConfigOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SystemConfigOrderType" AS ENUM ('SYSTEM_CONFIG_ORDER');

-- AlterTable
ALTER TABLE "SystemConfigOrder" DROP COLUMN "type",
ADD COLUMN     "type" "SystemConfigOrderType" NOT NULL DEFAULT 'SYSTEM_CONFIG_ORDER';

-- DropEnum
DROP TYPE "OrderSystemConfigType";

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigOrder_type_key" ON "SystemConfigOrder"("type");
