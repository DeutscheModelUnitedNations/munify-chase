/*
  Warnings:

  - You are about to drop the column `metaName` on the `ChairMessage` table. All the data in the column will be lost.
  - You are about to drop the column `metaName` on the `ResearchServiceMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conferenceId,nationId]` on the table `Delegation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- AlterTable
ALTER TABLE "ChairMessage" DROP COLUMN "metaName",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD';

-- AlterTable
ALTER TABLE "ResearchServiceMessage" DROP COLUMN "metaName",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD';

-- CreateIndex
CREATE UNIQUE INDEX "Delegation_conferenceId_nationId_key" ON "Delegation"("conferenceId", "nationId");
