-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credentialBackedUp" BOOLEAN,
ADD COLUMN     "credentialCounter" INTEGER,
ADD COLUMN     "credentialDeviceType" TEXT,
ADD COLUMN     "credentialID" TEXT,
ADD COLUMN     "credentialPublicKey" TEXT,
ADD COLUMN     "credentialTransports" TEXT;
