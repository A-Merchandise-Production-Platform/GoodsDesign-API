-- AlterTable
ALTER TABLE "Users" 
ADD COLUMN "email" TEXT,
ADD COLUMN "password" TEXT;

-- Set unique temporary values for existing records
WITH numbered_users AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rnum 
  FROM "Users"
)
UPDATE "Users"
SET email = CONCAT('temp_user_', numbered_users.rnum, '@temp.com'),
    password = ''
FROM numbered_users
WHERE "Users".id = numbered_users.id;

-- Make columns required and add unique constraint
ALTER TABLE "Users" 
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
