/*
  Warnings:

  - A unique constraint covering the columns `[conferenceId,email]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_committeeId_fkey";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "committeeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_conferenceId_email_key" ON "Team"("conferenceId", "email");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
