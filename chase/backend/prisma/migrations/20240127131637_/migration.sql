/*
  Warnings:

  - You are about to drop the column `emailValidated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailValidationTokenHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyPubKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CredentialsType" AS ENUM ('PASSWORD', 'PASSKEY');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailValidated",
DROP COLUMN "emailValidationTokenHash",
DROP COLUMN "passkeyPubKey",
DROP COLUMN "passwordHash";

-- CreateTable
CREATE TABLE "Credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CredentialsType" NOT NULL,
    "passwordHash" TEXT,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "emailValidationTokenHash" TEXT,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_userId_key" ON "Credentials"("userId");

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
