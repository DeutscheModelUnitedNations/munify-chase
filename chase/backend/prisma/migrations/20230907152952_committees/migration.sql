-- CreateTable
CREATE TABLE "Committee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "conferenceId" INTEGER NOT NULL,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Committee_name_conferenceId_key" ON "Committee"("name", "conferenceId");

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
