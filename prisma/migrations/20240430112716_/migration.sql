/*
  Warnings:

  - You are about to drop the `ConferenceCreateToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ConferenceCreateToken";

-- CreateTable
CREATE TABLE "ConferenceCreationToken" (
    "token" TEXT NOT NULL,

    CONSTRAINT "ConferenceCreationToken_pkey" PRIMARY KEY ("token")
);
