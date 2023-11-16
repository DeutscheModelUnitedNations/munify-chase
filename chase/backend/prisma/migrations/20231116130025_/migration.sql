-- CreateEnum
CREATE TYPE "CommitteeCategory" AS ENUM ('COMMITTEE', 'CRISIS', 'ICJ');

-- CreateEnum
CREATE TYPE "SpeakersListCategory" AS ENUM ('SPEAKERS_LIST', 'COMMENT_LIST', 'MODERATED_CAUCUS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CHAIR', 'DELEGATE', 'COMMITTEE_ADVISOR', 'OBSERVER', 'NON_STATE_ACTOR', 'SECRETARIAT', 'PRESS_CORPS', 'PARTICIPANT_CARE', 'TEAM', 'GUEST');

-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceCreateToken" (
    "token" TEXT NOT NULL,

    CONSTRAINT "ConferenceCreateToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "category" "CommitteeCategory" NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "isSubcommittee" BOOLEAN NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AgendaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakersList" (
    "id" TEXT NOT NULL,
    "agendaItemId" TEXT NOT NULL,
    "type" "SpeakersListCategory" NOT NULL,

    CONSTRAINT "SpeakersList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "chair_committeeId" TEXT,
    "advisor_committeeId" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conference_name_key" ON "Conference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_name_conferenceId_key" ON "Committee"("name", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_conferenceId_email_key" ON "Team"("conferenceId", "email");

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakersList" ADD CONSTRAINT "SpeakersList_agendaItemId_fkey" FOREIGN KEY ("agendaItemId") REFERENCES "AgendaItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_chair_committeeId_fkey" FOREIGN KEY ("chair_committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_advisor_committeeId_fkey" FOREIGN KEY ("advisor_committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
