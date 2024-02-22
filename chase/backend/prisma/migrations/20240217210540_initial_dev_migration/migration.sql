/*
  Warnings:

  - A unique constraint covering the columns `[committeeId,userId]` on the table `CommitteeMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommitteeMember_committeeId_userId_key" ON "CommitteeMember"("committeeId", "userId");
