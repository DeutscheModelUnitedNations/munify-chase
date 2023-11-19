-- CreateTable
CREATE TABLE "CountryBaseData" (
    "id" TEXT NOT NULL,
    "alpha3Code" TEXT NOT NULL,

    CONSTRAINT "CountryBaseData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonStateActorBaseData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "NonStateActorBaseData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialPersonBaseData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "SpecialPersonBaseData_pkey" PRIMARY KEY ("id")
);
