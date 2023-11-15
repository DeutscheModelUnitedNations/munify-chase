/*
  Warnings:

  - You are about to drop the column `committeeId` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_committeeId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "committeeId",
ADD COLUMN     "advisor_committeeId" TEXT,
ADD COLUMN     "chair_committeeId" TEXT;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_chair_committeeId_fkey" FOREIGN KEY ("chair_committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_advisor_committeeId_fkey" FOREIGN KEY ("advisor_committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
