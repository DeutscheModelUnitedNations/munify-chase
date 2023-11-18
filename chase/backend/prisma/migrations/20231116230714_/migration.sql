-- CreateTable
CREATE TABLE "Delegation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alpha3Code" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,

    CONSTRAINT "Delegation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelegationsOnCommittee" (
    "id" TEXT NOT NULL,
    "delegationId" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,

    CONSTRAINT "DelegationsOnCommittee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Delegation" ADD CONSTRAINT "Delegation_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegationsOnCommittee" ADD CONSTRAINT "DelegationsOnCommittee_delegationId_fkey" FOREIGN KEY ("delegationId") REFERENCES "Delegation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DelegationsOnCommittee" ADD CONSTRAINT "DelegationsOnCommittee_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
