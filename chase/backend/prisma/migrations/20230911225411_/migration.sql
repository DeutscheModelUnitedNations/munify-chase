/*
  Warnings:

  - The primary key for the `Committee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Conference` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_conferenceId_fkey";

-- AlterTable
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "conferenceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Committee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Committee_id_seq";

-- AlterTable
ALTER TABLE "Conference" DROP CONSTRAINT "Conference_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Conference_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Conference_id_seq";

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
