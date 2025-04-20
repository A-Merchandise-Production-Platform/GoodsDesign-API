-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "userBankId" TEXT;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userBankId_fkey" FOREIGN KEY ("userBankId") REFERENCES "UserBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
