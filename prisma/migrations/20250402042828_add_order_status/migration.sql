/*
  Warnings:

  - The values [COMPLETED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'ASSIGNED_TO_FACTORY', 'ACCEPTED', 'IN_PRODUCTION', 'DONE_PRODUCTION', 'WAITING_PAYMENT', 'WAITING_FILL_INFORMATION', 'DELIVERED', 'CANCELED');
ALTER TABLE "CustomerOrder" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TABLE "CustomerOrderDetail" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TABLE "FactoryOrderDetail" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;
