/*
  Warnings:

  - A unique constraint covering the columns `[userId,conferenceId]` on the table `ConferenceMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConferenceMember_userId_conferenceId_key" ON "ConferenceMember"("userId", "conferenceId");
