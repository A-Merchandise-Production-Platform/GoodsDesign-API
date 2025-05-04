-- AlterTable
ALTER TABLE "SystemConfigOrder" ADD COLUMN     "voucherBaseLimitedUsage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "voucherBaseMaxDiscountValue" INTEGER NOT NULL DEFAULT 100000;
