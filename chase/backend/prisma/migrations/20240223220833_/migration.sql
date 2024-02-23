/*
  Warnings:

  - You are about to drop the `ChairMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchServiceMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "MessageCategory" ADD VALUE 'TO_CHAIR';

-- AlterEnum
ALTER TYPE "MessageStatus" ADD VALUE 'ASSIGNED';

-- DropForeignKey
ALTER TABLE "ChairMessage" DROP CONSTRAINT "ChairMessage_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ChairMessage" DROP CONSTRAINT "ChairMessage_committeeId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchServiceMessage" DROP CONSTRAINT "ResearchServiceMessage_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchServiceMessage" DROP CONSTRAINT "ResearchServiceMessage_conferenceId_fkey";

-- DropTable
DROP TABLE "ChairMessage";

-- DropTable
DROP TABLE "ResearchServiceMessage";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "MessageCategory" NOT NULL DEFAULT 'TO_CHAIR',
    "message" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" "MessageStatus"[] DEFAULT ARRAY['UNREAD']::"MessageStatus"[],
    "metaEmail" TEXT,
    "metaDelegation" TEXT,
    "metaCommittee" TEXT,
    "metaAgendaItem" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
