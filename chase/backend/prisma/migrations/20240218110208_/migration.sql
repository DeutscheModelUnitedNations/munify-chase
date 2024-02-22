/*
  Warnings:

  - A unique constraint covering the columns `[speakersListId,committeeMemberId]` on the table `SpeakerOnList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SpeakerOnList_speakersListId_committeeMemberId_key" ON "SpeakerOnList"("speakersListId", "committeeMemberId");
