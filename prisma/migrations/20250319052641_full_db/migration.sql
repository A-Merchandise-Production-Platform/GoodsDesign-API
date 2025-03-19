/*
  Warnings:

  - You are about to drop the `CustomerOrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryOrderDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FactoryProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentTransactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffTasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemConfigBanks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemConfigColors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemConfigSizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckQuality" DROP CONSTRAINT "CheckQuality_orderDetailId_fkey";

-- DropForeignKey
ALTER TABLE "CheckQuality" DROP CONSTRAINT "CheckQuality_taskId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrderDetails" DROP CONSTRAINT "CustomerOrderDetails_designId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrderDetails" DROP CONSTRAINT "CustomerOrderDetails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrders" DROP CONSTRAINT "CustomerOrders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_designId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_factoryOrderId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetails" DROP CONSTRAINT "FactoryOrderDetails_orderDetailId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrders" DROP CONSTRAINT "FactoryOrders_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryProducts" DROP CONSTRAINT "FactoryProducts_blankVarianceId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryProducts" DROP CONSTRAINT "FactoryProducts_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrderHistory" DROP CONSTRAINT "OrderHistory_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransactions" DROP CONSTRAINT "PaymentTransactions_customerId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransactions" DROP CONSTRAINT "PaymentTransactions_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransactions" DROP CONSTRAINT "PaymentTransactions_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "StaffTasks" DROP CONSTRAINT "StaffTasks_taskId_fkey";

-- DropForeignKey
ALTER TABLE "StaffTasks" DROP CONSTRAINT "StaffTasks_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "CustomerOrderDetails";

-- DropTable
DROP TABLE "CustomerOrders";

-- DropTable
DROP TABLE "FactoryOrderDetails";

-- DropTable
DROP TABLE "FactoryOrders";

-- DropTable
DROP TABLE "FactoryProducts";

-- DropTable
DROP TABLE "PaymentTransactions";

-- DropTable
DROP TABLE "Payments";

-- DropTable
DROP TABLE "StaffTasks";

-- DropTable
DROP TABLE "SystemConfigBanks";

-- DropTable
DROP TABLE "SystemConfigColors";

-- DropTable
DROP TABLE "SystemConfigSizes";

-- DropTable
DROP TABLE "Tasks";

-- CreateTable
CREATE TABLE "SystemConfigBank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bin" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigColor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigSize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER NOT NULL,
    "depositPaid" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "qualityCheckStatus" "QualityCheckStatus" NOT NULL,
    "reworkStatus" "ReworkStatus" NOT NULL,

    CONSTRAINT "CustomerOrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PaymentType" NOT NULL,
    "paymentLog" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "paymentGatewayTransactionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "transactionLog" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taskname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "qualityCheckStatus" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL,
    "completedDate" TIMESTAMP(3),

    CONSTRAINT "StaffTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryProduct" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "blankVarianceId" TEXT NOT NULL,
    "productionCapacity" INTEGER NOT NULL,
    "estimatedProductionTime" INTEGER NOT NULL,

    CONSTRAINT "FactoryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrder" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "totalProductionCost" INTEGER NOT NULL,

    CONSTRAINT "FactoryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrderDetail" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productionCost" INTEGER NOT NULL,

    CONSTRAINT "FactoryOrderDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetail" ADD CONSTRAINT "CustomerOrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetail" ADD CONSTRAINT "CustomerOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_blankVarianceId_fkey" FOREIGN KEY ("blankVarianceId") REFERENCES "BlankVariances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
