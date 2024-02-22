/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailValidated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailValidationTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailValidationTokenHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyCredentialBackedUp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyCredentialCounter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyCredentialDeviceType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyCredentialID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkeyCredentialPublicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "emailValidated",
DROP COLUMN "emailValidationTokenExpiry",
DROP COLUMN "emailValidationTokenHash",
DROP COLUMN "passkeyCredentialBackedUp",
DROP COLUMN "passkeyCredentialCounter",
DROP COLUMN "passkeyCredentialDeviceType",
DROP COLUMN "passkeyCredentialID",
DROP COLUMN "passkeyCredentialPublicKey",
DROP COLUMN "passwordHash",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "CredentialsType";

-- CreateTable
CREATE TABLE "Password" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingCredentialCreateTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "PendingCredentialCreateTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "validationTokenId" TEXT,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_userId_email_key" ON "Email"("userId", "email");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingCredentialCreateTask" ADD CONSTRAINT "PendingCredentialCreateTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingCredentialCreateTask" ADD CONSTRAINT "PendingCredentialCreateTask_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_validationTokenId_fkey" FOREIGN KEY ("validationTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
