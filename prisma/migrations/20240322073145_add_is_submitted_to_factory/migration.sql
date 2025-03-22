-- Add isSubmitted column to Factory table with default value false
ALTER TABLE "Factory" ADD COLUMN "isSubmitted" BOOLEAN NOT NULL DEFAULT false; 