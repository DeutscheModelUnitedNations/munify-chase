-- CreateTable
CREATE TABLE "Conference" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceCreateToken" (
    "token" TEXT NOT NULL,

    CONSTRAINT "ConferenceCreateToken_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conferenceId" TEXT NOT NULL,
    "isSubcomittee" BOOLEAN NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conference_name_key" ON "Conference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_name_conferenceId_key" ON "Committee"("name", "conferenceId");

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
