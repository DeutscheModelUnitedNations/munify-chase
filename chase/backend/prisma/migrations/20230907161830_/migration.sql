/*
  Warnings:

  - Added the required column `abbreviation` to the `Committee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Committee" ADD COLUMN     "abbreviation" TEXT NOT NULL;
