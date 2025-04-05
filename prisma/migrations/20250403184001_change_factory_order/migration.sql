/*
  Warnings:

  - You are about to drop the column `factoryOrderDetailId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_factoryOrderDetailId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "factoryOrderDetailId",
ADD COLUMN     "factoryOrderId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
