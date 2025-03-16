/*
  Warnings:

  - You are about to alter the column `blankPrice` on the `BlankVariances` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `price` on the `CustomerOrderDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `totalPrice` on the `CustomerOrders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `shippingPrice` on the `CustomerOrders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `depositPaid` on the `CustomerOrders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `productionCost` on the `FactoryOrderDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `totalProductionCost` on the `FactoryOrders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount` on the `PaymentTransactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount` on the `Payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `basePrice` on the `ProductPositionType` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "BlankVariances" ALTER COLUMN "blankPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CustomerOrderDetails" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CustomerOrders" ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "shippingPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "depositPaid" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "FactoryOrderDetails" ALTER COLUMN "productionCost" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "FactoryOrders" ALTER COLUMN "totalProductionCost" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PaymentTransactions" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Payments" ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ProductPositionType" ALTER COLUMN "basePrice" SET DATA TYPE INTEGER;
