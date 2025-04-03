-- AlterTable
ALTER TABLE "Factory" ADD COLUMN     "staffId" TEXT;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
