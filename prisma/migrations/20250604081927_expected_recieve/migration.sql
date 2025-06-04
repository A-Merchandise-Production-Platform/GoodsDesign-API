-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "expectedReceiveAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SystemConfigOrder" ADD COLUMN     "minExpectedReceiveAt" INTEGER NOT NULL DEFAULT 3;
