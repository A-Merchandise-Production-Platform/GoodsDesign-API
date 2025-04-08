/*
  Warnings:

  - Made the column `currentProgress` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "currentProgress" SET NOT NULL,
ALTER COLUMN "currentProgress" SET DEFAULT 0;
