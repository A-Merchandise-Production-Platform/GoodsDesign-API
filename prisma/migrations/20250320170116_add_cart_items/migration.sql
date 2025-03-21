-- CreateTable
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
