-- AlterTable
ALTER TABLE "ConferenceMember" ADD COLUMN     "nonStateActorId" TEXT;

-- AddForeignKey
ALTER TABLE "ConferenceMember" ADD CONSTRAINT "ConferenceMember_nonStateActorId_fkey" FOREIGN KEY ("nonStateActorId") REFERENCES "NonStateActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
