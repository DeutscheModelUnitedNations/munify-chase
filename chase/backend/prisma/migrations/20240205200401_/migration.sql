/*
  Warnings:

  - The values [CHAIR,COMMITTEE_ADVISOR] on the enum `CommitteeRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommitteeRole_new" AS ENUM ('DELEGATE', 'OBSERVER');
ALTER TABLE "CommitteeMember" ALTER COLUMN "role" TYPE "CommitteeRole_new" USING ("role"::text::"CommitteeRole_new");
ALTER TYPE "CommitteeRole" RENAME TO "CommitteeRole_old";
ALTER TYPE "CommitteeRole_new" RENAME TO "CommitteeRole";
DROP TYPE "CommitteeRole_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConferenceRole" ADD VALUE 'CHAIR';
ALTER TYPE "ConferenceRole" ADD VALUE 'COMMITTEE_ADVISOR';
