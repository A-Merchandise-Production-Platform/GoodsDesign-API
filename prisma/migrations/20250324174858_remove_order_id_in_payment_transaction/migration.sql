/*
  Warnings:

  - You are about to drop the column `orderId` on the `PaymentTransaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_orderId_fkey";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "orderId";
