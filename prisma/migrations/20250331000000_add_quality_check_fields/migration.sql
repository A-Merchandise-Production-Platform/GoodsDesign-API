-- AlterTable
ALTER TABLE "FactoryOrderDetail" ADD COLUMN "qualityStatus" "QualityCheckStatus",
ADD COLUMN "qualityCheckedAt" TIMESTAMP(3),
ADD COLUMN "qualityCheckedBy" TEXT; 