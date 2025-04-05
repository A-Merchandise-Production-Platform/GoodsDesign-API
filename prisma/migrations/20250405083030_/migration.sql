/*
  Warnings:

  - The values [QUALITY_CHECK_PENDING,QUALITY_CHECK_PASSED,QUALITY_CHECK_FAILED] on the enum `OrderDetailStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PARTIAL_APPROVED] on the enum `QualityCheckStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderDetailStatus_new" AS ENUM ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'REWORK_COMPLETED', 'SHIPPED');
ALTER TABLE "FactoryOrderDetail" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CustomerOrderDetail" ALTER COLUMN "status" TYPE "OrderDetailStatus_new" USING ("status"::text::"OrderDetailStatus_new");
ALTER TABLE "FactoryOrderDetail" ALTER COLUMN "status" TYPE "OrderDetailStatus_new" USING ("status"::text::"OrderDetailStatus_new");
ALTER TYPE "OrderDetailStatus" RENAME TO "OrderDetailStatus_old";
ALTER TYPE "OrderDetailStatus_new" RENAME TO "OrderDetailStatus";
DROP TYPE "OrderDetailStatus_old";
ALTER TABLE "FactoryOrderDetail" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QualityCheckStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "CustomerOrderDetail" ALTER COLUMN "qualityCheckStatus" TYPE "QualityCheckStatus_new" USING ("qualityCheckStatus"::text::"QualityCheckStatus_new");
ALTER TABLE "Task" ALTER COLUMN "qualityCheckStatus" TYPE "QualityCheckStatus_new" USING ("qualityCheckStatus"::text::"QualityCheckStatus_new");
ALTER TABLE "CheckQuality" ALTER COLUMN "status" TYPE "QualityCheckStatus_new" USING ("status"::text::"QualityCheckStatus_new");
ALTER TABLE "FactoryOrderDetail" ALTER COLUMN "qualityStatus" TYPE "QualityCheckStatus_new" USING ("qualityStatus"::text::"QualityCheckStatus_new");
ALTER TYPE "QualityCheckStatus" RENAME TO "QualityCheckStatus_old";
ALTER TYPE "QualityCheckStatus_new" RENAME TO "QualityCheckStatus";
DROP TYPE "QualityCheckStatus_old";
COMMIT;
