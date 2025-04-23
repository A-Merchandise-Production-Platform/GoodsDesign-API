/*
  Warnings:

  - You are about to drop the column `minimumOrderQuantity` on the `Factory` table. All the data in the column will be lost.
  - You are about to drop the column `operationalHours` on the `Factory` table. All the data in the column will be lost.
  - You are about to drop the column `totalEmployees` on the `Factory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Factory" DROP COLUMN "minimumOrderQuantity",
DROP COLUMN "operationalHours",
DROP COLUMN "totalEmployees";
