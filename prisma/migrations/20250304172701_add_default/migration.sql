-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "password" SET DEFAULT '';
