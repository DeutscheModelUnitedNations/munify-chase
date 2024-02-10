-- CreateEnum
CREATE TYPE "CredentialsType" AS ENUM ('PASSWORD', 'PASSKEY');

-- CreateEnum
CREATE TYPE "ConferenceRole" AS ENUM ('ADMIN', 'SECRETARIAT', 'CHAIR', 'COMMITTEE_ADVISOR', 'NON_STATE_ACTOR', 'PRESS_CORPS', 'GUEST', 'PARTICIPANT_CARE', 'MISCELLANEOUS_TEAM');

-- CreateEnum
CREATE TYPE "CommitteeCategory" AS ENUM ('COMMITTEE', 'CRISIS', 'ICJ');

-- CreateEnum
CREATE TYPE "CommitteeStatus" AS ENUM ('FORMAL', 'INFORMAL', 'PAUSE', 'SUSPENSION', 'CLOSED');

-- CreateEnum
CREATE TYPE "CommitteeRole" AS ENUM ('DELEGATE', 'OBSERVER');

-- CreateEnum
CREATE TYPE "Presence" AS ENUM ('PRESENT', 'EXCUSED', 'ABSENT');

-- CreateEnum
CREATE TYPE "SpeakersListCategory" AS ENUM ('SPEAKERS_LIST', 'COMMENT_LIST', 'MODERATED_CAUCUS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CredentialsType" NOT NULL,
    "passwordHash" TEXT,
    "passkeyCredentialID" TEXT,
    "passkeyCredentialPublicKey" TEXT,
    "passkeyCredentialCounter" INTEGER,
    "passkeyCredentialDeviceType" TEXT,
    "passkeyCredentialBackedUp" BOOLEAN,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "emailValidationTokenHash" TEXT,
    "emailValidationTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceCreateToken" (
    "token" TEXT NOT NULL,

    CONSTRAINT "ConferenceCreateToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceMember" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "userId" TEXT,
    "role" "ConferenceRole" NOT NULL,
    "nonStateActorId" TEXT,

    CONSTRAINT "ConferenceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "category" "CommitteeCategory" NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "parentId" TEXT,
    "whiteboardContent" TEXT NOT NULL DEFAULT '<h1>Hello, World</h1>',
    "status" "CommitteeStatus" NOT NULL DEFAULT 'CLOSED',
    "statusHeadline" TEXT,
    "statusUntil" TIMESTAMP(3),

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeMember" (
    "id" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "userId" TEXT,
    "delegationId" TEXT,
    "presence" "Presence" NOT NULL DEFAULT 'ABSENT',

    CONSTRAINT "CommitteeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaItem" (
    "id" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

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
CREATE TABLE "Nation" (
    "id" TEXT NOT NULL,
    "alpha3Code" TEXT NOT NULL,

    CONSTRAINT "Nation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonStateActor" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "NonStateActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialPerson" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "SpecialPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delegation" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "nationId" TEXT NOT NULL,

    CONSTRAINT "Delegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommitteeMemberToSpeakersList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Conference_name_key" ON "Conference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ConferenceMember_userId_conferenceId_key" ON "ConferenceMember"("userId", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_name_conferenceId_key" ON "Committee"("name", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_abbreviation_conferenceId_key" ON "Committee"("abbreviation", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeMember_committeeId_delegationId_key" ON "CommitteeMember"("committeeId", "delegationId");

-- CreateIndex
CREATE UNIQUE INDEX "Nation_alpha3Code_key" ON "Nation"("alpha3Code");

-- CreateIndex
CREATE UNIQUE INDEX "NonStateActor_code_key" ON "NonStateActor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialPerson_code_key" ON "SpecialPerson"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_CommitteeMemberToSpeakersList_AB_unique" ON "_CommitteeMemberToSpeakersList"("A", "B");

-- CreateIndex
CREATE INDEX "_CommitteeMemberToSpeakersList_B_index" ON "_CommitteeMemberToSpeakersList"("B");

-- AddForeignKey
ALTER TABLE "ConferenceMember" ADD CONSTRAINT "ConferenceMember_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceMember" ADD CONSTRAINT "ConferenceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceMember" ADD CONSTRAINT "ConferenceMember_nonStateActorId_fkey" FOREIGN KEY ("nonStateActorId") REFERENCES "NonStateActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeMember" ADD CONSTRAINT "CommitteeMember_delegationId_fkey" FOREIGN KEY ("delegationId") REFERENCES "Delegation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaItem" ADD CONSTRAINT "AgendaItem_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakersList" ADD CONSTRAINT "SpeakersList_agendaItemId_fkey" FOREIGN KEY ("agendaItemId") REFERENCES "AgendaItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_nationId_fkey" FOREIGN KEY ("nationId") REFERENCES "Nation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommitteeMemberToSpeakersList" ADD CONSTRAINT "_CommitteeMemberToSpeakersList_A_fkey" FOREIGN KEY ("A") REFERENCES "CommitteeMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommitteeMemberToSpeakersList" ADD CONSTRAINT "_CommitteeMemberToSpeakersList_B_fkey" FOREIGN KEY ("B") REFERENCES "SpeakersList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
