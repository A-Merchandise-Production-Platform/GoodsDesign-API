/*
  Warnings:

  - You are about to drop the column `operationalHoursScoreWeight` on the `SystemConfigOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemConfigOrder" DROP COLUMN "operationalHoursScoreWeight",
ALTER COLUMN "capacityScoreWeight" SET DEFAULT 0.25,
ALTER COLUMN "productionCapacityScoreWeight" SET DEFAULT 0.2;
