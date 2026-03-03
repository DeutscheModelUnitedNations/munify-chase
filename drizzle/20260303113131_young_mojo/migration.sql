ALTER TYPE "committee_status" ADD VALUE 'MODERATED_INFORMAL' BEFORE 'PAUSE';--> statement-breakpoint
ALTER TABLE "committee" RENAME CONSTRAINT "committee_conferenceId_name_unique" TO "committee_conference_id_name_unique";--> statement-breakpoint
ALTER TABLE "committee" RENAME CONSTRAINT "committee_conferenceId_abbreviation_unique" TO "committee_conference_id_abbreviation_unique";--> statement-breakpoint
ALTER TABLE "representation" RENAME CONSTRAINT "representation_conferenceId_name_unique" TO "representation_conference_id_name_unique";--> statement-breakpoint
ALTER TABLE "representation" RENAME CONSTRAINT "representation_conferenceId_alpha2Code_alpha3Code_unique" TO "representation_conference_id_alpha2_code_alpha3_code_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_position_unique" TO "speaker_on_list_speakers_list_id_position_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_committeeMemberId_unique" TO "speaker_on_list_speakers_list_id_committee_member_id_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_conferenceMemberId_unique" TO "speaker_on_list_speakers_list_id_conference_member_id_unique";--> statement-breakpoint
ALTER TABLE "speakers_list" RENAME CONSTRAINT "speakers_list_agendaItemId_type_unique" TO "speakers_list_agenda_item_id_type_unique";