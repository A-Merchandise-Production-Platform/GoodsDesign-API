-- DropForeignKey
ALTER TABLE "Factory" DROP CONSTRAINT "Factory_addressId_fkey";

-- AlterTable
ALTER TABLE "Factory" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
