-- CreateTable
CREATE TABLE "UserBank" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "SystemConfigBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
