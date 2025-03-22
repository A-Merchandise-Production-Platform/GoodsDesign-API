-- AlterEnum
ALTER TYPE "FactoryStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "Factory" ALTER COLUMN "factoryStatus" SET DEFAULT 'DRAFT';
