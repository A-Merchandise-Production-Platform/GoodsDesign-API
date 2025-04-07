/*
  Warnings:

  - The values [NEED_ASSIGN] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'WAITING_FILL_INFORMATION', 'NEED_MANAGER_HANDLE', 'PENDING_ACCEPTANCE', 'REJECTED', 'IN_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'DONE_CHECK_QUALITY', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'WAITING_PAYMENT', 'READY_FOR_SHIPPING', 'SHIPPED', 'COMPLETED', 'CANCELED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;
