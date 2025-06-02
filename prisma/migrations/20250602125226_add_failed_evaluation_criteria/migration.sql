-- CreateTable
CREATE TABLE "CheckQualityFailedEvaluationCriteria" (
    "id" TEXT NOT NULL,
    "checkQualityId" TEXT NOT NULL,
    "evaluationCriteriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckQualityFailedEvaluationCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckQualityFailedEvaluationCriteria_checkQualityId_evaluat_key" ON "CheckQualityFailedEvaluationCriteria"("checkQualityId", "evaluationCriteriaId");

-- AddForeignKey
ALTER TABLE "CheckQualityFailedEvaluationCriteria" ADD CONSTRAINT "CheckQualityFailedEvaluationCriteria_checkQualityId_fkey" FOREIGN KEY ("checkQualityId") REFERENCES "CheckQuality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQualityFailedEvaluationCriteria" ADD CONSTRAINT "CheckQualityFailedEvaluationCriteria_evaluationCriteriaId_fkey" FOREIGN KEY ("evaluationCriteriaId") REFERENCES "EvaluationCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
