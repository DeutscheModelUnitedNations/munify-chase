/*
  Warnings:

  - Added the required column `speakingTime` to the `SpeakersList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpeakersList" ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "speakingTime" INTEGER NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3);
