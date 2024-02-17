/*
  Warnings:

  - A unique constraint covering the columns `[agendaItemId,type]` on the table `SpeakersList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SpeakersList_agendaItemId_type_key" ON "SpeakersList"("agendaItemId", "type");
