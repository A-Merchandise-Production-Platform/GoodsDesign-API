/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `SystemConfigSizes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Addresses" DROP CONSTRAINT "Addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOrders" DROP CONSTRAINT "CustomerOrders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Factory" DROP CONSTRAINT "Factory_factoryOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteDesign" DROP CONSTRAINT "FavoriteDesign_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransactions" DROP CONSTRAINT "PaymentTransactions_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDesigns" DROP CONSTRAINT "ProductDesigns_userId_fkey";

-- DropForeignKey
ALTER TABLE "StaffTasks" DROP CONSTRAINT "StaffTasks_userId_fkey";

-- AlterTable
ALTER TABLE "SystemConfigSizes" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL DEFAULT '',
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "dateOfBirth" TIMESTAMP(3),
    "imageUrl" TEXT DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "role" "Roles" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesigns" ADD CONSTRAINT "ProductDesigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrders" ADD CONSTRAINT "CustomerOrders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactions" ADD CONSTRAINT "PaymentTransactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTasks" ADD CONSTRAINT "StaffTasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_factoryOwnerId_fkey" FOREIGN KEY ("factoryOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
