-- CreateEnum
CREATE TYPE "Presence" AS ENUM ('PRESENT', 'EXCUSED', 'ABSENT');

-- AlterTable
ALTER TABLE "CommitteeMember" ADD COLUMN     "presence" "Presence" NOT NULL DEFAULT 'ABSENT';
