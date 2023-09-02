-- CreateTable
CREATE TABLE "Conference" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceCreateToken" (
    "token" TEXT NOT NULL,

    CONSTRAINT "ConferenceCreateToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conference_name_key" ON "Conference"("name");
