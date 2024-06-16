/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingCredentialCreateTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_userId_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_validationTokenId_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropForeignKey
ALTER TABLE "PendingCredentialCreateTask" DROP CONSTRAINT "PendingCredentialCreateTask_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "PendingCredentialCreateTask" DROP CONSTRAINT "PendingCredentialCreateTask_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- DropTable
DROP TABLE "Email";

-- DropTable
DROP TABLE "Password";

-- DropTable
DROP TABLE "PendingCredentialCreateTask";

-- DropTable
DROP TABLE "Token";
