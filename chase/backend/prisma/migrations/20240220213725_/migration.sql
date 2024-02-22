-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('GUEST_SPEAKER', 'FACT_CHECK', 'INFORMATION', 'GENERAL_SECRETARY', 'OTHER');

-- CreateTable
CREATE TABLE "ResearchServiceMessage" (
    "id" TEXT NOT NULL,
    "category" "MessageCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metaName" TEXT,
    "metaEmail" TEXT,
    "metaDelegation" TEXT,
    "metaCommittee" TEXT,
    "metaAgendaItem" TEXT,

    CONSTRAINT "ResearchServiceMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChairMessage" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metaName" TEXT,
    "metaEmail" TEXT,
    "metaDelegation" TEXT,
    "metaCommittee" TEXT,

    CONSTRAINT "ChairMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResearchServiceMessage" ADD CONSTRAINT "ResearchServiceMessage_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchServiceMessage" ADD CONSTRAINT "ResearchServiceMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChairMessage" ADD CONSTRAINT "ChairMessage_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChairMessage" ADD CONSTRAINT "ChairMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
