/*
  Warnings:

  - The primary key for the `SystemConfigBanks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SystemConfigColors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SystemConfigSizes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "SystemConfigBanks" DROP CONSTRAINT "SystemConfigBanks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SystemConfigBanks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SystemConfigBanks_id_seq";

-- AlterTable
ALTER TABLE "SystemConfigColors" DROP CONSTRAINT "SystemConfigColors_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SystemConfigColors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SystemConfigColors_id_seq";

-- AlterTable
ALTER TABLE "SystemConfigSizes" DROP CONSTRAINT "SystemConfigSizes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SystemConfigSizes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SystemConfigSizes_id_seq";
