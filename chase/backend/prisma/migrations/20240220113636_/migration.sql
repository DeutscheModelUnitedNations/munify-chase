/*
  Warnings:

  - You are about to drop the column `allowSpeakersToAddThemselves` on the `SpeakersList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Committee" ADD COLUMN     "allowDelegationsToAddThemselvesToSpeakersList" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SpeakersList" DROP COLUMN "allowSpeakersToAddThemselves";
