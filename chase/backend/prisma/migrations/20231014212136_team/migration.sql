-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CHAIR', 'DELEGATE', 'OBSERVER', 'NON_STATE_ACTOR', 'SECRETARIAT', 'PRESS_CORPS', 'PARTICIPANT_CARE', 'TEAM', 'GUEST');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "committeeId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
