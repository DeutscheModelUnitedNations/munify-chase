/*
  Warnings:

  - Changed the type of `category` on the `Committee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CommitteeCategory" AS ENUM ('COMMITTEE', 'CRISIS', 'ICJ');

-- AlterTable
ALTER TABLE "Committee" DROP COLUMN "category",
ADD COLUMN     "category" "CommitteeCategory" NOT NULL;
