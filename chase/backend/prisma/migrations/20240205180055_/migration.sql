/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation,conferenceId]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ConferenceMember" DROP CONSTRAINT "ConferenceMember_userId_fkey";

-- AlterTable
ALTER TABLE "ConferenceMember" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Committee_abbreviation_conferenceId_key" ON "Committee"("abbreviation", "conferenceId");

-- AddForeignKey
ALTER TABLE "ConferenceMember" ADD CONSTRAINT "ConferenceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
