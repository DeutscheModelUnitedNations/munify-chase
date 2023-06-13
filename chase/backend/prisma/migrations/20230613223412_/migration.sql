-- CreateEnum
CREATE TYPE "ConferenceRoles" AS ENUM ('ADMIN', 'TEAM', 'PARTICIPANT_COUNTRY', 'PARTICIPANT_NGO', 'OBSERVER');

-- CreateTable
CREATE TABLE "Conference" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceUser" (
    "userId" INTEGER NOT NULL,
    "conferenceId" INTEGER NOT NULL,
    "role" "ConferenceRoles" NOT NULL,

    CONSTRAINT "ConferenceUser_pkey" PRIMARY KEY ("userId","conferenceId")
);

-- AddForeignKey
ALTER TABLE "ConferenceUser" ADD CONSTRAINT "ConferenceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceUser" ADD CONSTRAINT "ConferenceUser_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
