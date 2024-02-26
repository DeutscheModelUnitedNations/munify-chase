/*
  Warnings:

  - The `type` column on the `Nation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NationVariant" AS ENUM ('NATION', 'NON_STATE_ACTOR', 'SPECIAL_PERSON');

-- AlterTable
ALTER TABLE "Nation" DROP COLUMN "type",
ADD COLUMN     "type" "NationVariant" NOT NULL DEFAULT 'NATION';

-- DropEnum
DROP TYPE "NationType";
