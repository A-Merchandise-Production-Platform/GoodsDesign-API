-- CreateTable
CREATE TABLE "SystemConfigColors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "SystemConfigColors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigSizes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "SystemConfigSizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigColors_name_key" ON "SystemConfigColors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigColors_code_key" ON "SystemConfigColors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigSizes_code_key" ON "SystemConfigSizes"("code");
