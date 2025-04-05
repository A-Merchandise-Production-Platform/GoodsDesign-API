/*
  Warnings:

  - The primary key for the `FactoryProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FactoryProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FactoryProduct" DROP CONSTRAINT "FactoryProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FactoryProduct_pkey" PRIMARY KEY ("factoryId", "systemConfigVariantId");
