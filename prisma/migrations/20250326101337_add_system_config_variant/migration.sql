/*
  Warnings:

  - You are about to drop the `SystemConfigColor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemConfigSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SystemConfigColor";

-- DropTable
DROP TABLE "SystemConfigSize";

-- CreateTable
CREATE TABLE "SystemConfigVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SystemConfigVariant" ADD CONSTRAINT "SystemConfigVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
