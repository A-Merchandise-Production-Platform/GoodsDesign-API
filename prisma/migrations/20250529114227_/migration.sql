/*
  Warnings:

  - You are about to drop the `_EvaluationCriteriaToOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EvaluationCriteriaToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EvaluationCriteriaToOrder" DROP CONSTRAINT "_EvaluationCriteriaToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_EvaluationCriteriaToOrder" DROP CONSTRAINT "_EvaluationCriteriaToOrder_B_fkey";

-- DropForeignKey
ALTER TABLE "_EvaluationCriteriaToProduct" DROP CONSTRAINT "_EvaluationCriteriaToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_EvaluationCriteriaToProduct" DROP CONSTRAINT "_EvaluationCriteriaToProduct_B_fkey";

-- DropTable
DROP TABLE "_EvaluationCriteriaToOrder";

-- DropTable
DROP TABLE "_EvaluationCriteriaToProduct";

-- CreateTable
CREATE TABLE "OrderEvaluationCriteria" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "evaluationCriteriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrderEvaluationCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderEvaluationCriteria_orderId_evaluationCriteriaId_key" ON "OrderEvaluationCriteria"("orderId", "evaluationCriteriaId");

-- AddForeignKey
ALTER TABLE "EvaluationCriteria" ADD CONSTRAINT "EvaluationCriteria_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvaluationCriteria" ADD CONSTRAINT "OrderEvaluationCriteria_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvaluationCriteria" ADD CONSTRAINT "OrderEvaluationCriteria_evaluationCriteriaId_fkey" FOREIGN KEY ("evaluationCriteriaId") REFERENCES "EvaluationCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
