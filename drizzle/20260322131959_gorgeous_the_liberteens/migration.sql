ALTER TABLE "amendment_sponsor" RENAME CONSTRAINT "amendment_sponsor_amendmentId_committeeMemberId_unique" TO "amendment_sponsor_amendment_id_committee_member_id_unique";--> statement-breakpoint
ALTER TABLE "committee" RENAME CONSTRAINT "committee_conferenceId_name_unique" TO "committee_conference_id_name_unique";--> statement-breakpoint
ALTER TABLE "committee" RENAME CONSTRAINT "committee_conferenceId_abbreviation_unique" TO "committee_conference_id_abbreviation_unique";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" RENAME CONSTRAINT "operative_clause_vote_paperId_clauseId_unique" TO "operative_clause_vote_paper_id_clause_id_unique";--> statement-breakpoint
ALTER TABLE "paper_clause_lock" RENAME CONSTRAINT "paper_clause_lock_paperId_clauseId_unique" TO "paper_clause_lock_paper_id_clause_id_unique";--> statement-breakpoint
ALTER TABLE "paper_editor" RENAME CONSTRAINT "paper_editor_paperId_conferenceUserId_unique" TO "paper_editor_paper_id_conference_user_id_unique";--> statement-breakpoint
ALTER TABLE "paper_sponsor" RENAME CONSTRAINT "paper_sponsor_paperId_committeeMemberId_unique" TO "paper_sponsor_paper_id_committee_member_id_unique";--> statement-breakpoint
ALTER TABLE "representation" RENAME CONSTRAINT "representation_conferenceId_name_unique" TO "representation_conference_id_name_unique";--> statement-breakpoint
ALTER TABLE "representation" RENAME CONSTRAINT "representation_conferenceId_alpha2Code_alpha3Code_unique" TO "representation_conference_id_alpha2_code_alpha3_code_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_position_unique" TO "speaker_on_list_speakers_list_id_position_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_committeeMemberId_unique" TO "speaker_on_list_speakers_list_id_committee_member_id_unique";--> statement-breakpoint
ALTER TABLE "speaker_on_list" RENAME CONSTRAINT "speaker_on_list_speakersListId_conferenceMemberId_unique" TO "speaker_on_list_speakers_list_id_conference_member_id_unique";--> statement-breakpoint
ALTER TABLE "speakers_list" RENAME CONSTRAINT "speakers_list_agendaItemId_type_unique" TO "speakers_list_agenda_item_id_type_unique";--> statement-breakpoint
ALTER TABLE "resolution_vote_result" RENAME CONSTRAINT "resolution_vote_result_paperId_unique" TO "resolution_vote_result_paper_id_key";