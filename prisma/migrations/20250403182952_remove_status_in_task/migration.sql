/*
  Warnings:

  - You are about to drop the column `factoryOrderId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_factoryOrderId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "factoryOrderId",
DROP COLUMN "status",
ADD COLUMN     "factoryOrderDetailId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_factoryOrderDetailId_fkey" FOREIGN KEY ("factoryOrderDetailId") REFERENCES "FactoryOrderDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
