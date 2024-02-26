/*
  Warnings:

  - You are about to drop the column `nonStateActorId` on the `ConferenceMember` table. All the data in the column will be lost.
  - You are about to drop the `NonStateActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpecialPerson` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NationType" AS ENUM ('NATION', 'NON_STATE_ACTOR', 'SPECIAL_PERSON');

-- DropForeignKey
ALTER TABLE "ConferenceMember" DROP CONSTRAINT "ConferenceMember_nonStateActorId_fkey";

-- AlterTable
ALTER TABLE "ConferenceMember" DROP COLUMN "nonStateActorId";

-- AlterTable
ALTER TABLE "Nation" ADD COLUMN     "type" "NationType" NOT NULL DEFAULT 'NATION';

-- DropTable
DROP TABLE "NonStateActor";

-- DropTable
DROP TABLE "SpecialPerson";

-- DropEnum
DROP TYPE "CommitteeRole";
