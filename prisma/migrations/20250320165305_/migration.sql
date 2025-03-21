/*
  Warnings:

  - You are about to drop the `ProductDesigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerOrderDetail" DROP CONSTRAINT "CustomerOrderDetail_designId_fkey";

-- DropForeignKey
ALTER TABLE "DesignPosition" DROP CONSTRAINT "DesignPosition_designId_fkey";

-- DropForeignKey
ALTER TABLE "FactoryOrderDetail" DROP CONSTRAINT "FactoryOrderDetail_designId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteDesign" DROP CONSTRAINT "FavoriteDesign_designId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDesigns" DROP CONSTRAINT "ProductDesigns_blankVariantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDesigns" DROP CONSTRAINT "ProductDesigns_userId_fkey";

-- DropTable
DROP TABLE "ProductDesigns";

-- CreateTable
CREATE TABLE "ProductDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blankVariantId" TEXT NOT NULL,
    "saved3DPreviewUrl" TEXT NOT NULL,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductDesign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_blankVariantId_fkey" FOREIGN KEY ("blankVariantId") REFERENCES "BlankVariances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPosition" ADD CONSTRAINT "DesignPosition_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetail" ADD CONSTRAINT "CustomerOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
