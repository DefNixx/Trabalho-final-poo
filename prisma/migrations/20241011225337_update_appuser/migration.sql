-- AlterTable
ALTER TABLE "AppUser" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "passwordValidity" DROP NOT NULL,
ALTER COLUMN "passwordExpires" DROP NOT NULL;
