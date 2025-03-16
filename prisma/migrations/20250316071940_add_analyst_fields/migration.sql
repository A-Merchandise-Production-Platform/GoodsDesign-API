-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER;
