/*
  Warnings:

  - The values [NON_STATE_ACTOR,PRESS_CORPS,PARTICIPANT_CARE] on the enum `CommitteeRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [TEAM] on the enum `ConferenceRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommitteeRole_new" AS ENUM ('CHAIR', 'COMMITTEE_ADVISOR', 'DELEGATE', 'OBSERVER');
ALTER TABLE "CommitteeMember" ALTER COLUMN "role" TYPE "CommitteeRole_new" USING ("role"::text::"CommitteeRole_new");
ALTER TYPE "CommitteeRole" RENAME TO "CommitteeRole_old";
ALTER TYPE "CommitteeRole_new" RENAME TO "CommitteeRole";
DROP TYPE "CommitteeRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ConferenceRole_new" AS ENUM ('ADMIN', 'SECRETARIAT', 'NON_STATE_ACTOR', 'PRESS_CORPS', 'GUEST', 'PARTICIPANT_CARE', 'MISCELLANEOUS_TEAM');
ALTER TABLE "ConferenceMember" ALTER COLUMN "role" TYPE "ConferenceRole_new" USING ("role"::text::"ConferenceRole_new");
ALTER TYPE "ConferenceRole" RENAME TO "ConferenceRole_old";
ALTER TYPE "ConferenceRole_new" RENAME TO "ConferenceRole";
DROP TYPE "ConferenceRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CommitteeMember" DROP CONSTRAINT "CommitteeMember_userId_fkey";

-- AlterTable
ALTER TABLE "CommitteeMember" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT;

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
