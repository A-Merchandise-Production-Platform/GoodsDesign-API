/*
  Warnings:

  - You are about to drop the column `estimatedProductionTime` on the `FactoryProduct` table. All the data in the column will be lost.
  - You are about to drop the column `cancelReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerNotes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveredAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `depositPaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCompletionDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedShippingDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `priorityLevel` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `OrderProgressReport` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrls` on the `OrderProgressReport` table. All the data in the column will be lost.
  - You are about to drop the `Addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `estimatedCheckQualityAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedCompletionAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedDoneProductionAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedShippingAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Addresses" DROP CONSTRAINT "Addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_designId_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_userId_fkey";

-- DropForeignKey
ALTER TABLE "Factory" DROP CONSTRAINT "Factory_addressId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPositionType" DROP CONSTRAINT "ProductPositionType_productId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "SystemConfigDiscount" DROP CONSTRAINT "SystemConfigDiscount_productId_fkey";

-- DropForeignKey
ALTER TABLE "SystemConfigVariant" DROP CONSTRAINT "SystemConfigVariant_productId_fkey";

-- AlterTable
ALTER TABLE "CheckQuality" ADD COLUMN     "imageUrls" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "FactoryProduct" DROP COLUMN "estimatedProductionTime",
ADD COLUMN     "productionTimeInMinutes" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cancelReason",
DROP COLUMN "cancellationDate",
DROP COLUMN "customerNotes",
DROP COLUMN "deliveredAt",
DROP COLUMN "deliveryAddress",
DROP COLUMN "depositPaid",
DROP COLUMN "estimatedCompletionDate",
DROP COLUMN "estimatedShippingDate",
DROP COLUMN "lastUpdated",
DROP COLUMN "priorityLevel",
DROP COLUMN "rejectionReason",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "doneCheckQualityAt" TIMESTAMP(3),
ADD COLUMN     "doneProductionAt" TIMESTAMP(3),
ADD COLUMN     "estimatedCheckQualityAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedCompletionAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedDoneProductionAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estimatedShippingAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "shippingPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderDetail" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderProgressReport" DROP COLUMN "notes",
DROP COLUMN "photoUrls",
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "note" TEXT;

-- DropTable
DROP TABLE "Addresses";

-- DropTable
DROP TABLE "CartItems";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Products";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "provinceID" INTEGER NOT NULL,
    "districtID" INTEGER NOT NULL,
    "wardCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factoryId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "model3DUrl" TEXT,
    "weight" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigDiscount" ADD CONSTRAINT "SystemConfigDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigVariant" ADD CONSTRAINT "SystemConfigVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPositionType" ADD CONSTRAINT "ProductPositionType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
