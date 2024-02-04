/*
  Warnings:

  - You are about to drop the column `credentialBackedUp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentialCounter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentialDeviceType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentialID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentialPublicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentialTransports` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "credentialBackedUp",
DROP COLUMN "credentialCounter",
DROP COLUMN "credentialDeviceType",
DROP COLUMN "credentialID",
DROP COLUMN "credentialPublicKey",
DROP COLUMN "credentialTransports",
ADD COLUMN     "passkeyCredentialBackedUp" BOOLEAN,
ADD COLUMN     "passkeyCredentialCounter" INTEGER,
ADD COLUMN     "passkeyCredentialDeviceType" TEXT,
ADD COLUMN     "passkeyCredentialID" TEXT,
ADD COLUMN     "passkeyCredentialPublicKey" TEXT;
