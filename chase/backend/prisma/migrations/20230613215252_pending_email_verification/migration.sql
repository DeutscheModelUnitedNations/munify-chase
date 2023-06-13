-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "PendingEmailVerification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PendingEmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingEmailVerification_userId_key" ON "PendingEmailVerification"("userId");

-- AddForeignKey
ALTER TABLE "PendingEmailVerification" ADD CONSTRAINT "PendingEmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
