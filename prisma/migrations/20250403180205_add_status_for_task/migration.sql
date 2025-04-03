/*
  Warnings:

  - Changed the type of `status` on the `StaffTask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StaffTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "StaffTask" DROP COLUMN "status",
ADD COLUMN     "status" "StaffTaskStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL;
