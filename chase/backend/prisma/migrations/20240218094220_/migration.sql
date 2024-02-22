/*
  Warnings:

  - You are about to drop the column `isPaused` on the `SpeakersList` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `SpeakersList` table. All the data in the column will be lost.
  - You are about to drop the `_CommitteeMemberToSpeakersList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `timeLeft` to the `SpeakersList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CommitteeMemberToSpeakersList" DROP CONSTRAINT "_CommitteeMemberToSpeakersList_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommitteeMemberToSpeakersList" DROP CONSTRAINT "_CommitteeMemberToSpeakersList_B_fkey";

-- AlterTable
ALTER TABLE "SpeakersList" DROP COLUMN "isPaused",
DROP COLUMN "timestamp",
ADD COLUMN     "startTimestamp" TIMESTAMP(3),
ADD COLUMN     "timeLeft" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CommitteeMemberToSpeakersList";

-- CreateTable
CREATE TABLE "SpeakerOnList" (
    "id" TEXT NOT NULL,
    "speakersListId" TEXT NOT NULL,
    "committeeMemberId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SpeakerOnList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpeakerOnList_speakersListId_position_key" ON "SpeakerOnList"("speakersListId", "position");

-- AddForeignKey
ALTER TABLE "SpeakerOnList" ADD CONSTRAINT "SpeakerOnList_speakersListId_fkey" FOREIGN KEY ("speakersListId") REFERENCES "SpeakersList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakerOnList" ADD CONSTRAINT "SpeakerOnList_committeeMemberId_fkey" FOREIGN KEY ("committeeMemberId") REFERENCES "CommitteeMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
