/*
  Warnings:

  - You are about to drop the column `isSubcomittee` on the `Committee` table. All the data in the column will be lost.
  - Added the required column `isSubcommittee` to the `Committee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Committee" DROP COLUMN "isSubcomittee",
ADD COLUMN     "isSubcommittee" BOOLEAN NOT NULL;
