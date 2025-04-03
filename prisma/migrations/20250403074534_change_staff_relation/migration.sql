/*
  Warnings:

  - A unique constraint covering the columns `[factoryOwnerId]` on the table `Factory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Factory_factoryOwnerId_key" ON "Factory"("factoryOwnerId");
