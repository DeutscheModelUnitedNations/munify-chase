/*
  Warnings:

  - You are about to drop the column `role` on the `CommitteeMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[committeeId,delegationId]` on the table `CommitteeMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CommitteeMember" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeMember_committeeId_delegationId_key" ON "CommitteeMember"("committeeId", "delegationId");
