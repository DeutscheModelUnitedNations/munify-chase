/*
  Warnings:

  - You are about to drop the `DelegationsOnCommittee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DelegationsOnCommittee" DROP CONSTRAINT "DelegationsOnCommittee_committeeId_fkey";

-- DropForeignKey
ALTER TABLE "DelegationsOnCommittee" DROP CONSTRAINT "DelegationsOnCommittee_delegationId_fkey";

-- DropTable
DROP TABLE "DelegationsOnCommittee";

-- CreateTable
CREATE TABLE "Delegate" (
    "id" TEXT NOT NULL,
    "delegationId" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,

    CONSTRAINT "Delegate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Delegate" ADD CONSTRAINT "Delegate_delegationId_fkey" FOREIGN KEY ("delegationId") REFERENCES "Delegation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delegate" ADD CONSTRAINT "Delegate_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
