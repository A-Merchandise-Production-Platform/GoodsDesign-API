-- CreateTable
CREATE TABLE "SystemConfigBanks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bin" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "transferSupported" BOOLEAN NOT NULL DEFAULT false,
    "lookupSupported" BOOLEAN NOT NULL DEFAULT false,
    "support" INTEGER NOT NULL DEFAULT 0,
    "isTransfer" BOOLEAN NOT NULL DEFAULT false,
    "swiftCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "SystemConfigBanks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigBanks_code_key" ON "SystemConfigBanks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigBanks_bin_key" ON "SystemConfigBanks"("bin");
