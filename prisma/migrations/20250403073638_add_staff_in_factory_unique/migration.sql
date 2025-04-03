/*
  Warnings:

  - A unique constraint covering the columns `[staffId]` on the table `Factory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Factory_staffId_key" ON "Factory"("staffId");
