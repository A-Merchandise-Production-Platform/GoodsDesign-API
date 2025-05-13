-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerWantedDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EvaluationCriteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productId" TEXT NOT NULL,

    CONSTRAINT "EvaluationCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EvaluationCriteriaToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EvaluationCriteriaToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EvaluationCriteriaToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EvaluationCriteriaToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EvaluationCriteriaToProduct_B_index" ON "_EvaluationCriteriaToProduct"("B");

-- CreateIndex
CREATE INDEX "_EvaluationCriteriaToOrder_B_index" ON "_EvaluationCriteriaToOrder"("B");

-- AddForeignKey
ALTER TABLE "_EvaluationCriteriaToProduct" ADD CONSTRAINT "_EvaluationCriteriaToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "EvaluationCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvaluationCriteriaToProduct" ADD CONSTRAINT "_EvaluationCriteriaToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvaluationCriteriaToOrder" ADD CONSTRAINT "_EvaluationCriteriaToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "EvaluationCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvaluationCriteriaToOrder" ADD CONSTRAINT "_EvaluationCriteriaToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
