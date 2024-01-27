/*
  Warnings:

  - You are about to drop the `Credentials` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailValidated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailValidationTokenHash" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "type" "CredentialsType" NOT NULL;

-- DropTable
DROP TABLE "Credentials";
